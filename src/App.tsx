import React, { useEffect } from "react";
import styled from "styled-components";
import "reset-css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm, useFieldArray } from "react-hook-form";
import { useRecoilState } from "recoil";
import { categoryState, IItem, itemsState } from "./atom";
const Container = styled.div`
  width: 50vw;
  min-width: 300px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 10px;
  font-family: brevia, sans-serif;
  background-image: linear-gradient(rgba(0, 0, 255, 0.6), rgba(0, 0, 255, 0.5));
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 28px;
  text-align: center;
  color: #030383;
`;

const TodoList = styled.form`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, auto));
  gap: 10px;
`;

const Fields = styled.div`
  margin-bottom: 10px;
  padding: 10px 0px 20px 0px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

  font-family: felt-tip-woman, sans-serif;
  font-size: 25px;
  font-weight: 600;
  color: #222121;
  label {
    font-weight: 700;
    padding: 5px;
  }
`;

const Input = styled.input`
  border-style: none;
  border-bottom: 1px solid #0404a5;
  background-color: inherit;
  font-family: felt-tip-woman, sans-serif;
  padding: 10px;
  font-size: 20px;
  ::placeholder {
    color: #4d4b4b;
  }
  :focus {
    outline-style: none;
  }
`;
const Btn = styled.button`
  border-style: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  background-color: inherit;
  align-items: center;
  cursor: pointer;
  color: #0404a5;
`;

const ToggleBtn = styled.button`
  border-radius: 3px;
  border-style: none;
  background-color: #0404a5;
  color: white;
  cursor: pointer;
`;

const ItemWrapper = styled.ul`
  margin-top: 10px;
  width: 70%;
`;

const Item = styled.li`
  margin: 10px;
  padding: 3px;
  border-bottom: 1px dashed blue;
  overflow-x: scroll;
  display: flex;
  justify-content: space-between;
  span::selection {
    background-color: #0404a5;
    color: white;
  }
`;

const CategoryForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    font-size: 15px;
    font-weight: 500;
    margin: 10px 0px;
    color: #0404a5;
  }

  input {
    color: white;
  }
  input::placeholder {
    color: white;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type FormValues = {
  item: IItem[];
  category: string;
  id?: number;
};

function App() {
  const { register, handleSubmit, resetField, control } = useForm<FormValues>({
    defaultValues: {
      category: "",
    },
  });
  const [categories, setCategories] = useRecoilState(categoryState);
  const [items, setItems] = useRecoilState(itemsState);
  const { fields, append, replace } = useFieldArray({
    control,
    name: "item",
  });
  useEffect(() => {
    const DB_Categories: string[] = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );
    const DB_Items: IItem[] = JSON.parse(localStorage.getItem("items") || "[]");
    const DB_Fields: FormValues[] = JSON.parse(
      localStorage.getItem("fields") || "[]"
    );
    setCategories(DB_Categories);
    setItems(DB_Items);
    replace(DB_Fields);
  }, [replace, setItems, setCategories]);

  const onSubmit = (data: FormValues) => {
    const { category } = data;
    const validation = categories.find((v) => v === category);
    if (!validation && category !== "") {
      setCategories((prev) => {
        localStorage.setItem("categories", JSON.stringify([...prev, category]));
        return [...prev, category];
      });

      append({
        name: "",
        id: Date.now(),
        category,
      });
      const prev = JSON.parse(localStorage.getItem("fields") || "[]");
      localStorage.setItem(
        "fields",
        JSON.stringify([
          ...prev,
          {
            name: "",
            id: Date.now(),
            category,
          },
        ])
      );
    }

    resetField("category");
    return;
  };
  const onTask = (data: FormValues) => {
    const { item } = data;
    const filterBlank = item.filter((v) => v.name !== "");
    setItems((prev) => {
      localStorage.setItem("items", JSON.stringify([...prev, ...filterBlank]));
      return [...prev, ...filterBlank];
    });
    const replaceArray = categories.map((v) => {
      return { name: "", category: v, id: Date.now() };
    });
    replace(replaceArray);
    return;
  };

  const onChange = (event: React.FormEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id, innerText },
    } = event;

    const index = items.findIndex((v) => v.id.toString() === id);
    const targetObj = items[index];
    setItems((prev) => {
      const front = prev.slice(0, index);
      const back = prev.slice(index + 1);
      const copyObj = { ...targetObj, category: innerText };
      localStorage.setItem(
        "items",
        JSON.stringify([...front, copyObj, ...back])
      );
      return [...front, copyObj, ...back];
    });
  };
  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <link rel="stylesheet" href="https://use.typekit.net/xxw0iyk.css" />
          <title>Just Do It</title>
        </Helmet>
        <div>
          <Title>1, 2, 3</Title>
          <Title>Just Do It</Title>
        </div>
        <CategoryForm onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="category">Create Category</label>
          <InputWrapper>
            <Input
              autoComplete="off"
              id="category"
              type={"type"}
              {...register("category")}
              placeholder="Write category"
            />
            <Btn type={"submit"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            </Btn>
          </InputWrapper>
        </CategoryForm>
        <div>
          <TodoList onSubmit={handleSubmit(onTask)}>
            {fields.map((field, index) => {
              const list = items.filter(
                (item) => item.category === field.category
              );
              return (
                <Fields key={field.id}>
                  <label>{field.category.toUpperCase()}</label>
                  <InputWrapper>
                    <Input
                      {...register(`item.${index}.name`)}
                      placeholder="Write something here"
                      autoComplete="off"
                    />
                    <Btn type={"submit"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Btn>
                  </InputWrapper>
                  <ItemWrapper>
                    {list?.map((item, i) => {
                      return (
                        <Item key={item.id}>
                          <span>{item.name}</span>
                          <div>
                            {categories.map((category) => {
                              return (
                                category !== field.category && (
                                  <ToggleBtn
                                    onClick={onChange}
                                    key={category}
                                    id={item.id + ""}
                                  >
                                    {category}
                                  </ToggleBtn>
                                )
                              );
                            })}
                          </div>
                        </Item>
                      );
                    })}
                  </ItemWrapper>
                </Fields>
              );
            })}
          </TodoList>
        </div>
      </Container>
    </HelmetProvider>
  );
}

export default App;
