'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

const DriverTabs = ({ activeTab, setActiveTab, tabContentList }) => {
  const handleTabChange = (event, newValue) => setActiveTab(newValue)

  return (
    <Card>
      <CardHeader title='Driver Management' />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label='driver management tabs'>
            <Tab label='Teams' value='teams' />
            <Tab label='Schedule' value='schedule' />
            <Tab label='Subschedules' value='subschedules' />
          </Tabs>
        </Box>

        <Box>{tabContentList[activeTab]}</Box>
      </CardContent>
    </Card>
  )
}

export default DriverTabs
