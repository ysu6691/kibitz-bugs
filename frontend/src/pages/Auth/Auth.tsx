import { getUsers } from "@/api/helix";
import { getAccessToken } from "@/api/oauth";
import { IAuthorizationBody } from "@/api/oauth/type";
import { LoadingSpinner } from "@/components";
import { userState } from "@/recoil/user/atoms";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const client_id = "ke8l9zd2f9fla9pf418ht24es2w4bi";
  const client_secret = "um2d2h0snv77dj3jq77gxrctmmuky7";
  const grant_type = "authorization_code";
  const redirect_uri = "http://localhost:5173/auth";

  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    if (code != null) {
      const body: IAuthorizationBody = {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: grant_type,
        redirect_uri: redirect_uri,
      };
      getAccessToken(body).then((res) => {
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;

        getUsers({
          accessToken: `Bearer ${accessToken}`,
          clientId: client_id,
        }).then((res) => {
          const name = res.data.data[0].display_name;
          const id = res.data.data[0].id;
          const email = res.data.data[0].email;
          const imgUrl = res.data.data[0].profile_image_url;

          setUser({
            name: name,
            id: id,
            email: email,
            imgUrl: imgUrl,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          navigate("/setting");
        });
      });
    } else {
      alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      navigate("/login");
    }
  }, []);

  return (
    <StyledAuth>
      <LoadingSpinner />
    </StyledAuth>
  );
}

export default Auth;

const StyledAuth = styled.main``;