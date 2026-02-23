import { Input, InputRef, Tag, Tooltip } from "antd";
import { useRef, useState } from "react";
import { UilPlus } from "@iconscout/react-unicons";
type MultiSelectProps = {
  listData: string[]; // contoh: array of string
  setListData: React.Dispatch<React.SetStateAction<string[]>>;
};
const MultiSelect: React.FC<MultiSelectProps> = ({ listData, setListData }) => {
  // Common Problem
  //   const [listData, setListData] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>([]);
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  // Tags
  const showInput = () => {
    setInputVisible(true);
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...listData];
    newTags[editInputIndex] = editInputValue;
    setListData(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };
  const handleClose = (removedTag: string) => {
    const newTags = listData.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setListData(newTags);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !listData?.includes(inputValue)) {
      setListData([...listData, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const tagInputStyle: React.CSSProperties = {
    // height: 42,
    marginTop: 10,
    // verticalAlign: "top",
    width: "30%",
  };
  const tagPlusStyle: React.CSSProperties = {
    height: 32,
    marginBottom: -10,
    background: "#fff",
    borderStyle: "dashed",
  };
  return (
    <div>
      {listData &&
        listData.map<React.ReactNode>((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={tag}
                size="small"
                style={tagInputStyle}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
                placeholder="Add Tag"
              />
            );
          }
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              style={{
                userSelect: "none",
              }}
              onClose={() => handleClose(tag)}
            >
              <span
                onDoubleClick={(e) => {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <p>
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            </p>
          ) : (
            tagElem
          );
        })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          placeholder="Add Problem and press enter"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag
          style={tagPlusStyle}
          icon={
            <UilPlus
              style={{
                marginTop: 3,
              }}
            />
          }
          onClick={showInput}
        >
          {/* Add Problem */}
        </Tag>
      )}
    </div>
  );
};
export default MultiSelect;
