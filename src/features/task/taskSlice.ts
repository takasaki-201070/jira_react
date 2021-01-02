import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY } from "../types";

// タスクの取得
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});
// ユーザ一覧の取得
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
// カテゴリの取得
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
// カテゴリの新規作成
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const res = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item: item },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
// タスクの新規作成
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
// タスクの更新
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
// タスクの削除
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      owner: 0,
      owner_username: "",
      responsible: 0,
      responsible_username: "",
      estimate: 0,
      category: 0,
      category_item: "",
      status: "",
      status_name: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    responsible: 0,
    estimate: 0,
    category: 0,
    status: "",
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    owner: 0,
    owner_username: "",
    responsible: 0,
    responsible_username: "",
    estimate: 0,
    category: 0,
    category_item: "",
    status: "",
    status_name: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};
// スライス生成
export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    selectTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // タスクの取得が正常終了
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action: PayloadAction<READ_TASK[]>) => {
        return {
          ...state,
          tasks: action.payload,
        };
      }
    );
    // タスクの取得が異常終了
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = "/";
    });
    // ユーザ一覧の取得の正常終了
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      (state, action: PayloadAction<USER[]>) => {
        return {
          ...state,
          users: action.payload,
        };
      }
    );
    // カテゴリの取得
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY[]>) => {
        return {
          ...state,
          category: action.payload,
        };
      }
    );
    // カテゴリの新規作成
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY>) => {
        return {
          ...state,
          category: [...state.category, action.payload],
        };
      }
    );
    // カテゴリの新規作成の異常終了
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      window.location.href = "/";
    });
    // タスクの新規作成が正常終了
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask,
        };
      }
    );
    // タスクの新規作成が異常終了
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = "/";
    });
    // タスクの更新の正常終了
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          ),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    // タスクの更新の異常終了
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = "/";
    });
    // タスクの削除の正常終了
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.tasks.filter((t) => t.id !== action.payload),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    );
    // タスクの削除の異常終了
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const { editTask, selectTask } = taskSlice.actions;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;
export default taskSlice.reducer;
