import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";

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
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "8px",
  gap: "8px",
};

/**@return {Promise<Post[]>} */
const getPost = async () => {
  return fetch("/api/posts").then((res) => res.json());
  //for error handling, please refer to https://react-query-v3.tanstack.com/guides/query-functions
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
  const queryClient = useQueryClient();
  const mutation = useMutation(addPost, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const { isLoading, error, data } = useQuery(["posts"], getPost);

  // Mutations
  const handleClick = () => {
    mutation.mutate({
      title: faker.company.name(),
      body: faker.lorem.paragraph(),
      name: faker.name.fullName(),
    });
  };

  if (isLoading) return <div style={containerStyle}>...loading</div>;
  if (error) return <div style={containerStyle}>error</div>;

  return (
    <div style={containerStyle}>
      <h1>
        React-Query (To{" "}
        <a
          target="_blank"
          href="/swr"
          style={{
            color: "#1111ff",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          SWR Page
        </a>
        )
      </h1>
      <hr />
      <div style={toolbarStyle}>
        <button onClick={handleClick}>ADD POST</button>
      </div>
      <div>POST count: {data.length}</div>
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
