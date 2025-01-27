import styled from "@emotion/styled";
import logo from "@assets/images/Logo.png";
import { textStyles } from "@/styles";

function SettingInfoCard() {
  return (
    <StyledSettingInfoCard>
      <img css={{ width: 160 }} src={logo} />
      <h2
        css={{
          marginBlock: 16,
          ...textStyles.contents,
        }}
      >
        How to play?
      </h2>
      <div>
        <p css={{ ...textStyles.contents, fontSize: 16 }}>
          {`1. 채팅에 원하는 좌표를 입력합니다.`}
        </p>
        <p
          css={{
            margin: `8px 0px 16px 16px`,
            ...textStyles.contents,
            fontSize: 16,
          }}
        >
          {`예) A1, D14, 8A...`}
        </p>
        <p css={{ marginBlock: 16, ...textStyles.contents, fontSize: 16 }}>
          {`2. 가장 많은 표를 획득한 좌표가 시청자의 수가 됩니다.`}
        </p>
        <p css={{ ...textStyles.contents, fontSize: 16 }}>
          {`3. 시간 내에 투표하지 않으면 패합니다.`}
        </p>
      </div>
    </StyledSettingInfoCard>
  );
}

export default SettingInfoCard;

const StyledSettingInfoCard = styled.section`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;
