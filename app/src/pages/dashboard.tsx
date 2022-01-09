import React from "react";
import styled from "styled-components";

import { Discover, Feed, Navigator } from "src/components";

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Navigator />
      <Feed />
      <Discover />
    </DashboardContainer>
  );
};

export default Dashboard;
