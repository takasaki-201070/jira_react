import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  addIcon: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  // モーダル画面の起動ON、OFF
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;

  // カテゴリの新規入力時に入力済を表す
  const isCatDisabled = inputText.length === 0;

  // カテゴリ入力した際の値
  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // 文字項目と数値項目全ての項目で何か入力されている場合
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  // レスポンシブを変更した際に値を格納
  const handleSelectRespChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };
  // ステータスの変更した際に値を格納
  const handleSelectStatusChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as string;
    dispatch(editTask({ ...editedTask, status: value }));
  };
  // カテゴリの変更した際に値を格納
  const handleSelectCatChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, category: value }));
  };
  // レスポンシブに表示するユーザの選択肢
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));
  // カテゴリの選択肢
  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
      <form>
        {/* 作業日数 estimate */}
        <TextField
          className={classes.field}
          label="作業日数"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        {/* タスク名 task */}
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="タスク名"
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        {/* Description*/}
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="作業内容"
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        {/* criteria*/}
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="完了基準"
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        {/* Responsible ユーザ一覧を表示する */}
        <FormControl className={classes.field}>
          <InputLabel>作業者</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        {/* Responsible ステータス一覧を表示する */}
        <FormControl className={classes.field}>
          <InputLabel>状態</InputLabel>
          <Select
            name="status"
            value={editedTask.status}
            onChange={handleSelectStatusChange}
          >
            <MenuItem value={1}>未着手</MenuItem>
            <MenuItem value={2}>作業中</MenuItem>
            <MenuItem value={3}>完了</MenuItem>
          </Select>
        </FormControl>
        <br />
        {/* category カテゴリ一覧を表示する */}
        <FormControl className={classes.field}>
          <InputLabel>カテゴリ</InputLabel>
          <Select
            name="category"
            value={editedTask.category}
            onChange={handleSelectCatChange}
          >
            {catOptions}
          </Select>
        </FormControl>
        {/* カテゴリ 新規追加用ボタン*/}
        <Fab
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>
        {/* カテゴリ 新規追加用のモーダル画面*/}
        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="カテゴリ追加"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              保存
            </Button>
          </div>
        </Modal>
        <br />
        {/* 更新ボタン */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "更新" : "追加"}
        </Button>
        {/* キャンセルボタン */}
        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          取消
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
