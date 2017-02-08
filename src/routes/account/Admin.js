import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import { createSelector } from 'reselect'
import AdminList from '../../components/account/admin/List'
import AdminSearch from '../../components/account/admin/Search'
import AdminModal from '../../components/account/admin/Modal'

function Admin({location, dispatch, accountAdmin, loading}) {
  const {
    list,
    pagination,
    currentItem,
    modalVisible,
    modalType,
    roleList
  } = accountAdmin
  const {field, keyword} = location.query

  const adminModalProps = {
    item: modalType === 'create'
      ? {}
      : currentItem,
    type: modalType,
    visible: modalVisible,
    roleList,
    onOk(data) {
      dispatch({type: `accountAdmin/${modalType}`, payload: data})
    },
    onCancel() {
      dispatch({type: 'accountAdmin/hideModal'})
    }
  }

  const adminListProps = {
    dataSource: list,
    loading,
    pagination: pagination,
    onPageChange(page) {
      const {query, pathname} = location
      dispatch(routerRedux.push({
        pathname: pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({type: 'accountAdmin/delete', payload: id})
    },
    onEditItem(item) {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    },
    onStatusItem(item) {
      dispatch({
        type: 'accountAdmin/updateStatus',
        payload: item
      })
    }
  }

  const adminSearchProps = {
    field,
    keyword,
    onSearch(fieldsValue) {
      !!fieldsValue.keyword.length
      ? dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword
        }
      }))
      : dispatch(routerRedux.push({pathname: location.pathname}))
    },
    onAdd() {
      dispatch({
        type: 'accountAdmin/showModal',
        payload: {
          modalType: 'create'
        }
      })
    }
  }

  const AdminModalGen = () => <AdminModal {...adminModalProps}/>

  return (
    <div className='content-inner'>
      <AdminSearch {...adminSearchProps}/>
      <AdminList {...adminListProps}/>
      <AdminModalGen/>
    </div>
  )
}

Admin.propTypes = {
  accountAdmin: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = createSelector(
  state => state.accountAdmin,
  state => state.loading.models.accountAdmin,
  (accountAdmin, loading) => {
    return {
      accountAdmin,
      loading
    }
  }
)

export default connect(mapStateToProps)(Admin)