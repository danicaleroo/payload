import type { TFunction } from '@payloadcms/translations'
import type { FolderOrDocument } from 'payload/shared'

import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import { SortDownIcon, SortUpIcon } from '../../../icons/Sort/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Pill } from '../../Pill/index.js'
import { Popup, PopupList } from '../../Popup/index.js'
import './index.scss'

const baseClass = 'sort-by-pill'

const sortOnOptions: {
  label: (t: TFunction) => React.ReactNode
  value: keyof FolderOrDocument['value']
}[] = [
  { label: (t) => t('general:name'), value: '_folderOrDocumentTitle' },
  { label: (t) => t('general:createdAt'), value: 'createdAt' },
  { label: (t) => t('general:updatedAt'), value: 'updatedAt' },
]
const orderOnOptions: {
  label: (t: TFunction) => React.ReactNode
  value: 'asc' | 'desc'
}[] = [
  {
    label: (t) => (
      <>
        <SortUpIcon />
        {t('general:ascending')}
      </>
    ),
    value: 'asc',
  },
  {
    label: (t) => (
      <>
        <SortDownIcon />
        {t('general:descending')}
      </>
    ),
    value: 'desc',
  },
]
export function SortByPill() {
  const { refineFolderData, sort } = useFolder()
  const { t } = useTranslation()
  const sortDirection = sort.startsWith('-') ? 'desc' : 'asc'
  const [selectedSortOption] = sortOnOptions.filter(
    ({ value }) => value === (sort.startsWith('-') ? sort.slice(1) : sort),
  )
  const [selectedOrderOption] = orderOnOptions.filter(({ value }) => value === sortDirection)

  return (
    <Popup
      button={
        <Pill className={`${baseClass}__trigger`} icon={<ChevronIcon />} size="small">
          {sortDirection === 'asc' ? (
            <SortUpIcon className={`${baseClass}__sort-icon`} />
          ) : (
            <SortDownIcon className={`${baseClass}__sort-icon`} />
          )}
          {selectedSortOption.label(t)}
        </Pill>
      }
      className={baseClass}
      horizontalAlign="right"
      render={({ close }) => (
        <>
          <PopupList.GroupLabel label="Sort by" />
          <PopupList.ButtonGroup>
            {sortOnOptions.map(({ label, value }) => (
              <PopupList.Button
                active={selectedSortOption.value === value}
                key={value}
                onClick={() => {
                  refineFolderData({
                    query: {
                      sort: value,
                    },
                    updateURL: true,
                  })
                  close()
                }}
              >
                {label(t)}
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
          <PopupList.Divider />
          <PopupList.GroupLabel label="Order" />
          <PopupList.ButtonGroup>
            {orderOnOptions.map(({ label, value }) => (
              <PopupList.Button
                active={selectedOrderOption.value === value}
                className={`${baseClass}__order-option`}
                key={value}
                onClick={() => {
                  if (value === 'asc') {
                    refineFolderData({
                      query: {
                        sort: value === 'asc' ? `-${sort}` : sort,
                      },
                      updateURL: true,
                    })
                  }
                  close()
                }}
              >
                {label(t)}
              </PopupList.Button>
            ))}
          </PopupList.ButtonGroup>
        </>
      )}
      showScrollbar
      verticalAlign="bottom"
    />
  )
}
