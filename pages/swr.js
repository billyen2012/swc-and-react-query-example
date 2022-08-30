import { faker } from "@faker-js/faker";
import useSWR, { useSWRConfig } from "swr";

/**
 * @typedef {{
 * name:string;
 * title:string;
 * body:string;
 * }} Post
 */

const containerStyle = {
  padding: "24px",
};

const cardStyle = {
  display: "flex",
  padding: "24px",
  flexDirection: "column",
  gap: "8px",
  border: "solid 1px #efefef",
};

const toolbarStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "8px",
};

/**@return {Promise<Post[]>} */
const getPost = async () => {
  return fetch("/api/posts").then((res) => res.json());
  //for error handling, please refer to https://swr.vercel.app/docs/error-handling
};

const addPost = async (data) => {
  return fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
};

export default function Home() {
  const { data, error } = useSWR("posts", getPost);

  const { mutate } = useSWRConfig();

  // Mutations
  const handleClick = async () => {
    const response = await addPost({
      title: faker.company.name(),
      body: faker.lorem.paragraph(),
      name: faker.name.fullName(),
    });

    if (response.ok) mutate("posts");
  };

  if (!data) return <div style={containerStyle}>...loading</div>;
  if (error) return <div style={containerStyle}>error</div>;

  return (
    <div style={containerStyle}>
      <h1>SWR</h1>
      <hr />
      <div style={toolbarStyle}>
        <button onClick={handleClick}>ADD POST</button>
      </div>
      POST count: {data.length}
      {data.length == 0
        ? "No Data"
        : data.map(({ name, title, body }, index) => {
            return (
              <div style={cardStyle}>
                <h3>
                  {index + 1}: {title}
                </h3>
                <span>Author: {name}</span>
                <p>{body}</p>
              </div>
            );
          })}
    </div>
  );
}
