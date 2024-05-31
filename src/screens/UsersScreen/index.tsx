import { StyleSheet, Text, View, SafeAreaView, ListRenderItem, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomScreenHeader from '../../components/customScreenHeader'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerMenuStackParamList } from '../../types/DrawerMenuStackParamList'
import { TodosTypes } from '../../types/TodosTypes'
import { User } from '../../types/UsersTypes'
import { apiCall } from '../../services/ApiRequest'
import Pagination from '../../components/pagination'
import DefaultUserIcon from '../../icons/DefaultUserIcon'
import MoreVerticalIcon from '../../icons/MoreVerticalIcon'
import UserCard from '../../components/userCard'
import MainLayout from '../../layouts/MainLayout'

const UsersScreen = () => {
    const listRef = useRef<FlatList>(null)
    const navigation = useNavigation<DrawerNavigationProp<DrawerMenuStackParamList>>()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchUser, setSearchUser] = useState('')
    const [users, setUsers] = useState<[User] | []>([])

    const renderUsers: ListRenderItem<User> = ({ item, index }) => <UserCard user={item} />

    const totalPages = Math.ceil(users.length / 10)

    const currentUsers = users.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    )

    const getUsers = async () => {
        const users = await apiCall('users')
        if (users) setUsers(users)
    }

    const filteredUsers = currentUsers.filter(item => item.name.toLowerCase().includes(searchUser.toLowerCase()))


    useEffect(() => {
        getUsers()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
              
            <MainLayout>

            {
                    users.length > 0 &&
                    <FlatList
                        ref={listRef}
                        ListHeaderComponent={  <CustomScreenHeader
                            inputPlaceHolder='Kullanıcı ara'
                            inputValue={searchUser}
                            setInputValue={setSearchUser}
                            navigation={navigation}
                        />}
                        data={filteredUsers}
                        renderItem={renderUsers}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<Pagination currentPage={currentPage} listRef={listRef} onPageChange={setCurrentPage} totalPages={totalPages} />}
                    />

                }
            </MainLayout>
        </SafeAreaView>
    )
}

export default UsersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
   

})