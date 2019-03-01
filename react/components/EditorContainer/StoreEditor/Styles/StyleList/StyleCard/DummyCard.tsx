import React from 'react'
import ContentLoader from 'react-content-loader'
import { Card } from 'vtex.styleguide'

import Colors from '../../components/Colors'
import Typography from '../../components/Typography'

const DummyCard: React.SFC = () => {
  return (
    <div className="mh3 mb3">
      <Card noPadding>
        <div className="ph5 pt5 pb2">
          <div className="flex justify-between items-center mb4">
            <div className="flex items-center h2 w-80">
              <ContentLoader
                height={140}
                speed={1}
                primaryColor={'#333'}
                secondaryColor={'#999'}
              >
                <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
              </ContentLoader>
            </div>
          </div>
          <div className="flex justify-between items-center mb5">
            <div className="flex items-center">
              <Typography
                textColor="#979899"
                typography={{
                  fontFamily: 'Fabriga',
                  fontSize: '38px',
                  fontWeight: 700,
                  letterSpacing: 0,
                  textTransform: 'initial',
                }}
              />
              <div className="pl5">
                <Colors colors={['#979899', '#CACBCC', '#E3E4E6', '#F2F4F5']} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DummyCard
