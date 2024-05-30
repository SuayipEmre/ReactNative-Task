import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { apiCall } from '../../services/ApiRequest'
import Pagination from '../../components/pagination'
import { TodosTypes } from '../../types/TodosTypes'
import CheckboxUncheckedIcon from '../../icons/CheckboxUncheckedIcon'
import CheckboxCheckedIcon from '../../icons/CheckboxCheckedIcon'
import { DrawerMenuStackParamList } from '../../types/DrawerMenuStackParamList'
import CustomScreenHeader from '../../components/customScreenHeader'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { ITEMS_PER_PAGE } from '../../constants/itemsPerPage'




const TodosScreen: React.FC = () => {

    const navigation = useNavigation<DrawerNavigationProp<DrawerMenuStackParamList>>();
    const [todos, setTodos] = useState<[TodosTypes] | []>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchTodos, setSearchTodos] = useState('')
    const listRef = useRef<FlatList>(null)

    const getTodos = async () => {
        const todoData = await apiCall('todos')
        if (todoData) setTodos(todoData)
    }

    useEffect(() => {
        getTodos()
    }, [])

    const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE);

    const currentTodos = todos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const renderTodos: ListRenderItem<TodosTypes> = ({ item, index }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, }}>
            {
                item.completed ? <CheckboxCheckedIcon /> : <CheckboxUncheckedIcon />
            }
            <Text style={{ fontSize: 14, fontWeight: 400, }}>{item.title}</Text>
        </View>
    )

    const filteredTodos = currentTodos.filter(item => item.title.toLowerCase().includes(searchTodos.toLowerCase()))

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.content}>

                {
                    todos.length > 0 && <FlatList
                        ref={listRef}
                        data={filteredTodos}
                        ListHeaderComponent={< >
                            <CustomScreenHeader
                                navigation={navigation}
                                inputPlaceHolder='Görev Ara'
                                inputValue={searchTodos}
                                setInputValue={setSearchTodos}
                            />
                        </>}
                        renderItem={renderTodos}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, }}
                        ListFooterComponent={<Pagination currentPage={currentPage} listRef={listRef} onPageChange={setCurrentPage} totalPages={totalPages} />}
                    />

                }

            </View>

        </SafeAreaView>
    )
}

export default TodosScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ffffff',
    },
    content: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
    }

})