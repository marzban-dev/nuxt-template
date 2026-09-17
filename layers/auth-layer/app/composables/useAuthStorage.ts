const useAuthStorage = () => {
    const maxAge = 60 * 60 * 24 * 30; // 30 days

    const options = {
        maxAge: maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        path: "/",
        secure: true,
        sameSite: "lax",
    } as const;

    const token = useCookie("token", options);
    const refreshToken = useCookie("refresh-token", options);

    return { token, refreshToken };
};

export default useAuthStorage;
