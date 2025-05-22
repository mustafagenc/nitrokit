import SharedLayout from '@/components/layout/shared';

export default async function Home() {
    return (
        <SharedLayout>
            {Array.from(Array(10).keys()).map(i => (
                <p key={i} className="text-md mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra ac
                    neque vitae mollis. Phasellus iaculis, arcu aliquet fermentum pulvinar, quam
                    libero dapibus sapien, sed fringilla mi lectus id lacus. Nulla facilisi. Sed
                    semper, lacus vitae semper sodales, nunc massa rutrum nulla, quis sodales massa
                    ex quis ante. Morbi laoreet nibh sit amet pellentesque pulvinar. Pellentesque at
                    velit ex. Etiam faucibus risus id cursus laoreet. Integer iaculis nunc ut
                    volutpat pretium. Suspendisse euismod ornare tempor. Pellentesque tortor eros,
                    luctus bibendum porta vehicula, tincidunt sit amet ipsum. Etiam suscipit
                    ultricies libero, et scelerisque massa rhoncus in. Nullam pulvinar nisi ac
                    lectus malesuada pretium. Maecenas et aliquet justo.
                </p>
            ))}
        </SharedLayout>
    );
}
