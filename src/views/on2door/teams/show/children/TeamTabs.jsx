'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

const TeamTabs = ({ activeTab, setActiveTab, tabContentList }) => {

  const handleTabChange = (event, newValue) => setActiveTab(newValue)

  return (
    <Card>
      <CardHeader title='Team Management' />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label='team management tabs'>
            <Tab label='Hub' value='hub' />
            <Tab label='Dispatchers' value='dispatchers' />
            <Tab label='Drivers' value='drivers' />
          </Tabs>
        </Box>

        <Box>{tabContentList[activeTab]}</Box>
      </CardContent>
    </Card>
  )
}

export default TeamTabs
