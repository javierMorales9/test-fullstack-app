import routes from "./routes";

export function handleSSRResponseFail(res) {
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
