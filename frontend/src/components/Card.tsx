import styled from "@emotion/styled";
import BumpyBox from "../assets/images/bumpyBox.svg";

interface ICardProps {
  children: string | JSX.Element | JSX.Element[];
}

function Card({ children }: ICardProps) {
  return (
    <StyledCard
      css={{ backgroundImage: `url(${BumpyBox})`, backgroundSize: "cover" }}
    >
      {children}
    </StyledCard>
  );
}

export default Card;

const StyledCard = styled.div`
  width: 100%;
  aspect-ratio: 16 / 8.4;
  & > svg {
    fill: white;
  }
`;
