import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  Button,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  FormControl,
  ModalFooter,
  Input,
  ModalCloseButton,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { newsUpdated, selectNewsById } from "../../reducers/newsSlice";
import { fetchNewsById } from "../../reducers/newsSlice";

export const NewsEdit = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  //const news = useSelector((state) => selectNewsById(state, newsId));
  const dispatch = useDispatch();
  const { newsId } = useParams();
  const { state } = useLocation();
  const [news, setNews] = useState({ ...state?.news });

  useEffect(() => {
    if (!state) {
      dispatch(fetchNewsById(newsId)).then((response) => {
        setNews(response.payload);
      });
    }
  }, [newsId, state]);

  const [title, setTitle] = useState(news.title);
  const [body, setBody] = useState(news.body);
  const [image, setImage] = useState(news.image);

  const navigate = useNavigate();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onBodyChanged = (e) => setBody(e.target.value);
  const onImageChanged = (e) => setImage(e.target.files[0]);

  const onSaveNews = () => {
    if (title && body) {
      dispatch(newsUpdated({ id: newsId, title, body }));
      navigate("/dmin");
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        backdropFilter="blur(20px)"
        size={"lg"}
        scrollBehavior="outside"
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent rounded={0} bgColor={"rgba(255, 255, 255, 0.75)"}>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Post header</FormLabel>
              <Textarea ref={initialRef} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Post text</FormLabel>
              <Textarea resize={"vertical"} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Post Image</FormLabel>
              <Input
                px={"1"}
                variant="unstyled"
                type={"file"}
                accept="image/*"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save changes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
