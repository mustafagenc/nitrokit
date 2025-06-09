import 'server-only';
import { env } from '@/lib/env';
import { logger } from '@/lib/services/logger';

interface RaindropCollection {
    _id: number;
    title: string;
    description?: string;
    count: number;
    public: boolean;
    color: string;
    created: string;
    lastUpdate: string;
}

interface RaindropBookmark {
    _id: number;
    title: string;
    excerpt: string;
    note: string;
    type: string;
    link: string;
    domain: string;
    created: string;
    lastUpdate: string;
    tags: string[];
    media: Array<{
        link: string;
        type: string;
    }>;
    cover: string;
}

interface RaindropResponse<T> {
    result: boolean;
    items: T[];
    count: number;
    collectionId?: number;
}

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1';

const getRequestOptions = (): RequestInit => ({
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RAINDROP_ACCESS_TOKEN}`,
        'User-Agent': 'Nitrokit/1.0',
    },
});

export const getCollections = async (): Promise<RaindropCollection[] | null> => {
    try {
        logger.info('Fetching Raindrop collections', {
            service: 'raindrop',
            action: 'get_collections',
        });

        if (!env.RAINDROP_ACCESS_TOKEN) {
            logger.warn('Raindrop access token not configured', {
                service: 'raindrop',
                action: 'get_collections',
            });
            return null;
        }

        const response = await fetch(`${RAINDROP_API_URL}/collections`, getRequestOptions());

        if (!response.ok) {
            logger.error('Raindrop API error', undefined, {
                service: 'raindrop',
                action: 'get_collections',
                status: response.status,
                statusText: response.statusText,
            });
            return null;
        }

        const data: RaindropResponse<RaindropCollection> = await response.json();

        logger.info('Raindrop collections fetched successfully', {
            service: 'raindrop',
            action: 'get_collections',
            collectionsCount: data.items?.length || 0,
        });

        return data.items || [];
    } catch (error) {
        logger.error(
            'Raindrop collections fetch failed',
            error instanceof Error ? error : undefined,
            {
                service: 'raindrop',
                action: 'get_collections',
            }
        );
        return null;
    }
};

export const getBookmark = async (
    id: number,
    perPage: string = '3',
    pageIndex: string = '0'
): Promise<RaindropResponse<RaindropBookmark> | null> => {
    try {
        logger.info('Fetching Raindrop bookmarks', {
            service: 'raindrop',
            action: 'get_bookmarks',
            collectionId: id,
            perPage: parseInt(perPage),
            pageIndex: parseInt(pageIndex),
        });

        if (!env.RAINDROP_ACCESS_TOKEN) {
            logger.warn('Raindrop access token not configured', {
                service: 'raindrop',
                action: 'get_bookmarks',
            });
            return null;
        }

        const searchParams = new URLSearchParams({
            page: pageIndex,
            perpage: perPage,
        });

        const response = await fetch(
            `${RAINDROP_API_URL}/raindrops/${id}?${searchParams}`,
            getRequestOptions()
        );

        if (!response.ok) {
            logger.error('Raindrop bookmarks API error', undefined, {
                service: 'raindrop',
                action: 'get_bookmarks',
                collectionId: id,
                status: response.status,
                statusText: response.statusText,
            });
            return null;
        }

        const data: RaindropResponse<RaindropBookmark> = await response.json();

        logger.info('Raindrop bookmarks fetched successfully', {
            service: 'raindrop',
            action: 'get_bookmarks',
            collectionId: id,
            bookmarksCount: data.items?.length || 0,
            totalCount: data.count,
        });

        return data;
    } catch (error) {
        logger.error(
            'Raindrop bookmarks fetch failed',
            error instanceof Error ? error : undefined,
            {
                service: 'raindrop',
                action: 'get_bookmarks',
                collectionId: id,
            }
        );
        return null;
    }
};

export const getBookmarkById = async (bookmarkId: number): Promise<RaindropBookmark | null> => {
    try {
        logger.info('Fetching single Raindrop bookmark', {
            service: 'raindrop',
            action: 'get_bookmark_by_id',
            bookmarkId,
        });

        const response = await fetch(
            `${RAINDROP_API_URL}/raindrop/${bookmarkId}`,
            getRequestOptions()
        );

        if (!response.ok) {
            logger.error('Raindrop bookmark API error', undefined, {
                service: 'raindrop',
                action: 'get_bookmark_by_id',
                bookmarkId,
                status: response.status,
            });
            return null;
        }

        const data = await response.json();

        logger.info('Raindrop bookmark fetched successfully', {
            service: 'raindrop',
            action: 'get_bookmark_by_id',
            bookmarkId,
        });

        return data.item;
    } catch (error) {
        logger.error('Raindrop bookmark fetch failed', error instanceof Error ? error : undefined, {
            service: 'raindrop',
            action: 'get_bookmark_by_id',
            bookmarkId,
        });
        return null;
    }
};

export const getUserStats = async () => {
    try {
        logger.info('Fetching Raindrop user stats', {
            service: 'raindrop',
            action: 'get_user_stats',
        });

        const response = await fetch(`${RAINDROP_API_URL}/user/stats`, getRequestOptions());

        if (!response.ok) {
            logger.error('Raindrop user stats API error', undefined, {
                service: 'raindrop',
                action: 'get_user_stats',
                status: response.status,
            });
            return null;
        }

        const data = await response.json();

        logger.info('Raindrop user stats fetched successfully', {
            service: 'raindrop',
            action: 'get_user_stats',
        });

        return data;
    } catch (error) {
        logger.error(
            'Raindrop user stats fetch failed',
            error instanceof Error ? error : undefined,
            {
                service: 'raindrop',
                action: 'get_user_stats',
            }
        );
        return null;
    }
};

export const checkRaindropConnection = async (): Promise<boolean> => {
    try {
        if (!env.RAINDROP_ACCESS_TOKEN) {
            return false;
        }

        const response = await fetch(`${RAINDROP_API_URL}/user`, getRequestOptions());
        return response.ok;
    } catch {
        return false;
    }
};

export const getRaindropConfig = () => ({
    isConfigured: !!env.RAINDROP_ACCESS_TOKEN,
    collectionId: env.RAINDROP_COLLECTION_ID,
    apiUrl: RAINDROP_API_URL,
});
