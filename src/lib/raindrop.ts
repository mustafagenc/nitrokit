import 'server-only';

import { env } from '@/lib/env';

const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RAINDROP_ACCESS_TOKEN}`,
    },
};

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1';

const getCollections = async () => {
    try {
        const response = await fetch(`${RAINDROP_API_URL}/collections`, options);
        const collections = await response.json();
        return collections;
    } catch (error) {
        console.info(error);
        return null;
    }
};

const getBookmark = async (id: number, perPage: string = '3', pageIndex: string = '0') => {
    try {
        const response = await fetch(
            `${RAINDROP_API_URL}/raindrops/${id}?` +
                new URLSearchParams({
                    page: pageIndex,
                    perpage: perPage,
                }),
            options
        );
        return await response.json();
    } catch (error) {
        console.info(error);
        return null;
    }
};

export { getCollections, getBookmark };

// https://api.raindrop.io/rest/v1/collections
// https://api.raindrop.io/rest/v1/collection/{id}
// https://api.raindrop.io/rest/v1/user/stats
// https://api.raindrop.io/rest/v1/raindrop/{id}
// https://api.raindrop.io/rest/v1/tags/{collectionId}
// https://api.raindrop.io/rest/v1/raindrops/{collectionId}/filters
