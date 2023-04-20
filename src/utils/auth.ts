import routes from "./routes";

export function handleSSRResponseFail(res: Response) {
  const { status } = res;
  if (status === 401) {
    return {
      redirect: {
        destination: routes.login,
        permanent: false,
      },
    };
  }
}
