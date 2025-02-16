import React, { useEffect, useState } from "react";
import {
    Container,
    Stack,
    Pagination,
    PaginationItem,
    Card,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Comment from "./Comment.jsx";
import AddComment from "./AddComment.jsx";
import { setCommentSection } from "../../store/reducers/commentSlice";
import { commentService } from "../../services";
import { useAuth } from ".././../hooks/use-auth.js";

const Core = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useAuth().userIsAuthenticated();
    const [page, setPage] = useState(parseInt(location?.search?.split("=")[1] || 1));
    const [pageQty, setPageQty] = useState();
    const { comments } = useSelector((state) => state.comment.commentSection);

    useEffect(() => {
        const getComments = async () => {
            try {
                const { data } = await commentService.getComments(page);
                dispatch(setCommentSection(data));
                setPageQty(data.pages);
                setPage(data.page);

                if (data.pages < page) {
                    setPage(1);
                    navigation("/comments", { replace: true });
                }
            } catch (e) {
                console.log(e);
            }
        };

        getComments();
    }, [page, location.search, navigation]);

    return (
        pageQty &&
        pageQty > 0 && (
            <Container
                maxWidth="md"
                sx={{
                    animation: "fadeIn 0.4s ease-in",
                    "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(15px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                <Card
                    sx={{
                        p: 4,
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                        borderRadius: 4,
                        backgroundColor: "#f9f9f9",
                        transition: "all 0.3s ease",
                        "&:hover": { boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)" },
                    }}
                >
                    <Stack spacing={2} alignItems="center">
                        {!!pageQty && (
                            <Pagination
                                count={pageQty}
                                page={page}
                                onChange={(_, num) => setPage(num)}
                                showFirstButton
                                showLastButton
                                sx={{
                                    my: 2,
                                    ".MuiPaginationItem-root": {
                                        borderRadius: "8px",
                                        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.2)",
                                        },
                                    },
                                }}
                                renderItem={(item) => (
                                    <PaginationItem
                                        component={Link}
                                        to={`?page=${item.page}`}
                                        {...item}
                                    />
                                )}
                            />
                        )}
                    </Stack>

                    <Stack
                        spacing={3}
                        sx={{
                            marginTop: "20px",
                            animation: "fadeSlide 0.4s ease-in-out",
                            "@keyframes fadeSlide": {
                                from: { opacity: 0, transform: "translateY(20px)" },
                                to: { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        {comments.length > 0 &&
                            comments.map((comment) => (
                                <Comment key={comment._id} onPass={comment} />
                            ))}
                        {comments.length === 0 && (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: "center",
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                }}
                            >
                                {t("core.noComments")}
                            </Typography>
                        )}
                        {page === 1 && isAuthenticated && <AddComment />}
                    </Stack>
                </Card>
            </Container>
        )
    );
};

export default Core;