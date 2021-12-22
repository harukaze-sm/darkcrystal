import styled from "styled-components";

type TextInputProps = {
  seperateTop?: boolean;
  seperateBottom?: boolean;
};

export default styled.input<TextInputProps>`
  min-width: 14rem;
  min-height: 40px;
  border: 1px solid blue;
  margin-bottom: ${({ seperateBottom }) => (seperateBottom ? "1rem" : 0)};
  margin-top: ${({ seperateTop }) => (seperateTop ? "1rem" : 0)};
`;
