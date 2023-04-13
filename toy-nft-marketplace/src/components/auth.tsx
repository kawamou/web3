import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

const Auth = ({ children }: { children: React.ReactNode }) => {
  const [_, isLogin, , , , ,] = useAuth();
  const router = useRouter();

  (async () => {
    const islogin = await isLogin();
    if (!islogin) {
      router.push("/signin");
    }
  })();

  return children;
};
