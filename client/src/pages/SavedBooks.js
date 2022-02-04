// import React, { useState, useEffect } from "react";
// import React, { useState } from "react";
import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

// import { getMe, deleteBook } from '../utils/API';
import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  // const { loading, data } = useQuery(GET_ME);
  // // const userData = data?.me || {};
  // const [deleteBook] = useMutation(REMOVE_BOOK);
  // //   , {
  // //   update(cache, { data: { bookId } }) {
  // //     // read what's currently in the cache
  // //     try {
  // //       const { me } = cache.readQuery({ query: GET_ME });
  // //       cache.writeQuery({
  // //         query: GET_ME,
  // //         data: { me: { ...me, bookId, ...me.savedBooks } },
  // //         // data: { data: [bookId, ...me.savedBooks] },
  // //       });
  // //       // const { books } = cache.readQuery({ query: GET_ME });

  // //       // // prepend the newest thought to the front of the array
  // //       // cache.writeQuery({
  // //       //   query: GET_ME,
  // //       //   data: { books: [deleteBook, ...books] },
  // //       // });
  // //     } catch (e) {
  // //       console.error(e);
  // //     }
  // //     // update me object's cache, appending new thought to the end of the array
  // //     // const { me } = cache.readQuery({ query: GET_ME });
  // //     // cache.writeQuery({
  // //     //   query: GET_ME,
  // //     //   data: { data: { ...me.savedBooks } },
  // //     // });
  // //   },
  // // });
  // const userData = data?.me || {};
  // console.log(userData.savedBooks);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // // use this to determine if `useEffect()` hook needs to run again
  // // const userDataLength = Object.keys(userData).length;

  // // useEffect(() => {
  // //   const getUserData = async () => {
  // //     try {
  // //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  // //       if (!token) {
  // //         return false;
  // //       }

  // //       const response = await getMe(token);

  // //       if (!response.ok) {
  // //         throw new Error("something went wrong!");
  // //       }

  // //       const user = await response.json();
  // //       setUserData(user);
  // //     } catch (err) {
  // //       console.error(err);
  // //     }
  // //   };

  // //   getUserData();
  // // }, [userDataLength]);

  // // create function that accepts the book's mongo _id value as param and deletes the book from the database
  // const handleDeleteBook = async (bookId) => {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }

  //   try {
  //     // const response = await deleteBook(bookId, token);

  //     // if (!response.ok) {
  //     //   throw new Error("something went wrong!");
  //     // }

  //     // const updatedUser = await response.json();
  //     // setUserData(updatedUser);
  //     await deleteBook({
  //       variables: { bookId: bookId },
  //       update: (cache) => {
  //         const data = cache.readQuery({ query: GET_ME });
  //         const userDataCache = data.me;
  //         const savedBooksCache = userDataCache.savedBooks;
  //         const updatedBookCache = savedBooksCache.filter(
  //           (book) => book.bookId !== bookId
  //         );
  //         data.me.savedBooks = updatedBookCache;
  //         cache.writeQuery({
  //           query: GET_ME,
  //           data: { data: { ...data.me.savedBooks } },
  //         });
  //       },
  //     });
  //     console.log(userData.savedBooks);
  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // // if data isn't here yet, say so
  // // if (!userDataLength) {
  // //   return <h2>LOADING...</h2>;
  // // }
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId },
        update: (cache) => {
          const data = cache.readQuery({ query: GET_ME });
          const userDataCache = data.me;
          const savedBooksCache = userDataCache.savedBooks;
          const updatedBookCache = savedBooksCache.filter(
            (book) => book.bookId !== bookId
          );
          console.log(data.me.savedBooks);
          console.log(savedBooksCache);
          console.log(updatedBookCache);
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: { me: { ...data.me, savedBooks: updatedBookCache } },
            },
          });
        },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
