/*
 * @Author: Chenxu
 * @Date: 2023-01-13 10:23:17
 * @LastEditTime: 2023-02-16 15:43:19
 * @Msg: Nothing
 */
import { createGroup, getStuByTec, getTecList } from '@/apis/index'
import { DataList, useDataList } from '@/components/data-list'
import SafeArea from '@/components/safearea'
import { Search } from '@/components/search'
import { useUserReduce } from '@/src/provider/user-provider'
import { Tabs } from '@taroify/core'
import { Clear } from '@taroify/icons'
import { Button, Checkbox, CheckboxGroup, Text, View } from '@tarojs/components'
import { navigateBack } from '@tarojs/router'
import Taro from '@tarojs/taro'
import moment from 'moment'
import { FC, useMemo, useReducer, useState } from 'react'

import './index.scss'

interface DataListBoxProps {
  params?: Object
  type: 'student' | 'teacher'
  selectList: string[]
  onSelect: (openIDList: string[]) => void
}

const DataListBox: FC<DataListBoxProps> = ({ params = {}, type, selectList, onSelect }) => {

  const { status, dataList, dispatch } = useDataList({
    request: type === 'student' ? getStuByTec : getTecList,
    params
  })

  const showTag = (data: any) => {
    if(data.zhicheng) {
      return data.zhicheng
    }
    if(data.pycc === '02') {
      return '博士'
    }
    if(data.pycc === '01') {
      return '硕士'
    }
    return false
  }

  return (
    <View className="datalist-box">
      <DataList status={status} dispatch={dispatch}>
        <CheckboxGroup onChange={e => onSelect(e.detail.value)}>
          {[...dataList].map(({ data }) => (
            <View className="item flex-row">
              <Text className="item-left">{data.name}</Text>
              <View className="item-center flex-col">
                {showTag(data) && <View className='item-tag'>{showTag(data)}</View>}
                <Text className='item-desc'>{data['yuanxi_id.name']}</Text>
              </View>
              <Checkbox
                className='item-right'
                color='#3370FF'
                value={data['user_id.fsopen_id']}
              ></Checkbox>
            </View>
          ))}
        </CheckboxGroup>
      </DataList>
    </View>
  )
}

const StudentsGroup: FC = () => {

  const [searchValue, setSearchValue] = useState('')
  const { state: userInfo } = useUserReduce()
  const params = useMemo(() => {
    const tecid = () => {
      if (userInfo.teacherInfo?.zhicheng !== '教秘' && userInfo.teacherInfo?.zhicheng !== '超管') {
        return userInfo.teacherInfo?.id
      }
    }
    const yuanxiidName = () => {
      if (userInfo.teacherInfo?.zhicheng === '教秘') {
        return userInfo.teacherInfo?.['yuanxi_id.name']
      }
    }
    return {
      searchValue,
      tecid: tecid(),
      yuanxiidName: yuanxiidName()
    }
  }, [searchValue])

  interface selectListType {
    tecOpenIDList: string[]
    stuOpenIDList: string[]
  }

  const selectListReducer = (preState: selectListType, action: {
    type: 'student' | 'teacher' | 'clear'
    data: string[]
  }) => {
    if (action.type === 'student') {
      return { tecOpenIDList: preState.tecOpenIDList, stuOpenIDList: action.data }
    }
    if (action.type === 'teacher') {
      return { stuOpenIDList: preState.stuOpenIDList, tecOpenIDList: action.data }
    }
    if (action.type === 'clear') {
      return { stuOpenIDList: [], tecOpenIDList: [] }
    }
    return preState
  }
  const [selectList, setSelectList] = useReducer(selectListReducer, {
    tecOpenIDList: [],
    stuOpenIDList: []
  })

  const createGroupHandle = async () => {
    Taro.showLoading({ title: '建群中..', mask: true })
    const userIdList = [...selectList.stuOpenIDList, ...selectList.tecOpenIDList]
    if (userIdList.length < 2) {
      Taro.showToast({ icon: 'none', title: '请至少选择两位群成员' })
      return
    }
    try {
      await createGroup({
        topic: '答辩沟通群',
        open_id: userInfo.fsopen_id,
        userIdList
      })
      Taro.showToast({ icon: 'success', title: '建群成功' })
      navigateBack()
    } catch (error) {
      Taro.showToast({ icon: 'error', title: '建群失败' })
      console.log(error)
    }
  }

  return (
    <View className='group-page'>
      <View className='search-box flex-row items-center'>
        <View style={{ flex: 1 }}>
          <Search onConfirm={value => setSearchValue(value)}></Search>
        </View>
      </View>

      <Tabs lazyRender onChange={() => setSearchValue('')} className='tabs-custom'>
        <Tabs.TabPane title="教师列表">
          <DataListBox selectList={selectList.tecOpenIDList} onSelect={openIDList => setSelectList({ type: 'teacher', data: openIDList })} type="teacher" params={params} />
        </Tabs.TabPane>
        <Tabs.TabPane title="学生列表">
          <DataListBox selectList={selectList.stuOpenIDList} onSelect={openIDList => setSelectList({ type: 'student', data: openIDList })} type="student" params={params} />
        </Tabs.TabPane>
      </Tabs>

      <View className='bottom-info'>
        <View className='flex-row items-center justify-between'>
          <View className='bottom-left flex-row items-center'>
            <Text className='bottom-text'>已选{selectList.tecOpenIDList.length}位老师，{selectList.stuOpenIDList.length}位学生</Text>
            <Clear onClick={() => setSelectList({ type: 'clear', data: [] })} color='#93B3FF' />
          </View>
          <Button onClick={createGroupHandle} className='bottom-right' hoverClass='bottom-right-hover' size="default">完成</Button>
        </View>
        <SafeArea />
      </View>
      <SafeArea />
    </View>
  )
}

export default StudentsGroup
