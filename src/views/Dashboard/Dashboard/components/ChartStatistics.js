import { Flex, Progress, Text, useColorModeValue } from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import React from "react";

const ChartStatistics = ({ title, amount, icon, percentage }) => {
  const iconRecode = useColorModeValue("recode.300", "recode.300");
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Flex direction='column'>
      <Flex alignItems='center' minW='0'>
        <IconBox as='box' h={"30px"} w={"30px"} bg={iconRecode} me='6px'>
          {icon}
        </IconBox>
        <Text fontSize='sm' color='gray.400' fontWeight='semibold' noOfLines={1}>
          {title}
        </Text>
      </Flex>
      <Text fontSize='lg' color={textColor} fontWeight='bold' mb='6px' my='6px'>
        {amount}
      </Text>
      <Progress
        colorScheme='recode'
        borderRadius='12px'
        h='5px'
        value={percentage}
      />
    </Flex>
  );
};

export default ChartStatistics;
