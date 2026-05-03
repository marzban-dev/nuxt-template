const useServerSideAuthCheck = (enabled = true) => {
    const { checkAuth } = useAuth();
    const { suspense } = useGetAccount();

    onServerPrefetch(async () => {
        if (enabled) {
            const isValid = await checkAuth();
            if (isValid) {
                await suspense();
            }
        }
    });
};

export default useServerSideAuthCheck;