// src/App.jsx

import React from 'react';
// We need to import the components we use
import { Box, Heading } from '@chakra-ui/react';

function App() {
  return (
    // 'Box' is a container. We'll give it a red background ('bg')
    // and some padding ('p')
    <Box bg='tomato' w='100%' p={4} color='white'>
      <Heading>Testing Chakra UI</Heading>
      <p>If you can see this red box, it's working!</p>
    </Box>
  );
}

export default App;