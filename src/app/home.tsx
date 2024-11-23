import { FC, useEffect } from "react"
import { Alert, Button, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { TodoProps, useTodoFormState, useTodoState } from "./atom";
import { useSQLiteContext } from "expo-sqlite";
import * as todoSchema from "../database/schemas/todoSchema"
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";

export const Home: FC = () => {
  const { name, setName } = useTodoFormState();
  const { todos, addTodo, setTodos, removeTodo } = useTodoState();

  const database = useSQLiteContext()
  const db = drizzle(database, { schema: todoSchema })

  async function fetchTodos() {
    try {
      const response = await db.query.todo.findMany({
        orderBy: [asc(todoSchema.todo.name)],
      })

      const responseTratada: TodoProps[] = response.map((todo) => ({
        ...todo,
        isCompleted: todo.isCompleted ? true : false
      }))

      setTodos(responseTratada)
    } catch (error) {
      console.log(error)
    }
  }

  async function add() {
    if (name) {
      try {
        const response = await db.insert(todoSchema.todo).values({ name })
  
        Alert.alert("Registered with ID: " + response.lastInsertRowId);
  
        addTodo({
          id: response.lastInsertRowId,
          name,
          isCompleted: false
        });
  
        setName("");
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function remove(id: number) {
    try {
      Alert.alert("Remove", "Do you really want to remove?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, why not",
          onPress: async () => {
            await db
              .delete(todoSchema.todo)
              .where(eq(todoSchema.todo.id, id))

            removeTodo(id);
          },
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  function show(id: number) {
    const todo = todos.find(t => t.id === id);

    if (todo) {
      Alert.alert(
        `Todo ID: ${todo.id} registered as ${todo.name}`
      )
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingTop: 64,
        paddingHorizontal: 32
      }}
    >
      <TextInput
        placeholder="Nome"
        style={{
          height: 54,
          borderWidth: 1,
          borderRadius: 7,
          borderColor: "#999",
          paddingHorizontal: 16,
        }}
        onChangeText={setName}
        value={name}
      />

      <Button title="Save" onPress={add} />
      <Button title="Refresh DB" onPress={fetchTodos} />

      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={{ padding: 16, borderWidth: 1, borderRadius: 7 }}
            onLongPress={() => remove(item.id)}
            onPress={() => show(item.id)}
          >
            <Text>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={() => <Text>Lista vazia.</Text>}
        contentContainerStyle={{ gap: 16 }}
      />
    </SafeAreaView>
  );
}