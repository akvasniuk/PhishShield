import { Box, Card, Stack, Typography, Avatar, Button } from "@mui/material";
import React, { useState } from "react";
import replyArrow from "../../assets/images/icons/icon-reply.svg";
import AddReply from "./AddReply.jsx";
import OwnReply from "./OwnReply.jsx";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../hooks/use-auth.js";
import { commentService } from "../../services";
import { useTranslation } from "react-i18next";

const RepliesSection = ({
                            onReplies,
                            onClicked,
                            onTar,
                            setClicked: clickedFun,
                            id,
                        }) => {
    const { t } = useTranslation();
    const authUser = useAuth().getUser();
    const [repliess, setReplies] = useState(onReplies);
    const [clicked, setClicked] = useState(false);
    const [reply, setReply] = useState();

    const addReply = async (data) => {
        let replyMessage;
        try {
            const payload = {
                reply: data,
                username: `${authUser.firstname} ${authUser.lastname}`,
            };

            if (reply) {
                payload.replyCommentId = reply.user._id;
            }

            const response = await commentService.createReplyComment(authUser._id, id, payload);
            replyMessage = response.data;

            const replyObj = {
                _id: replyMessage.replies[replyMessage.replies.length - 1]._id,
                commentId: replyMessage._id,
                reply: replyMessage.replies[replyMessage.replies.length - 1].reply,
                createdAt: new Date(),
                score: replyMessage.replies[replyMessage.replies.length - 1].score,
                username: `${authUser.firstname} ${authUser.lastname}`,
                userId: authUser._id,
                user: { ...authUser },
                answerToUser:
                    replyMessage.replies[replyMessage.replies.length - 1].answerToUser ?? null,
            };

            setReplies([...repliess, replyObj]);
        } catch (e) {
            console.error(t("repliesSection.error"));
        }
    };

    const deleteReply = async (idReply) => {
        try {
            setReplies(repliess.filter((reply) => reply._id !== idReply));
            await commentService.deleteReplyComment(authUser._id, id, idReply);
        } catch (e) {
            console.error(t("repliesSection.error"));
        }
    };

    const formatTimestamp = (timestamp) => {
        const parsedDate = new Date(timestamp);
        if (isNaN(parsedDate)) {
            return t("repliesSection.createdNow");
        } else {
            return formatDistanceToNow(parsedDate, {
                addSuffix: true,
            });
        }
    };

    return (
        <Stack
            spacing={2}
            sx={{
                width: "800px",
                alignSelf: "flex-end",
                animation: "fadeIn 0.4s ease-in-out",
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {repliess.map((rep) => {
                const { reply, createdAt, score, username, userId, answerToUser } = rep;
                const createdData = formatTimestamp(createdAt);

                return userId === authUser?._id ? (
                    <OwnReply
                        key={rep._id}
                        comId={rep._id}
                        onContent={reply}
                        onTime={createdAt}
                        onCount={score}
                        onTar={answerToUser || onTar}
                        onDel={deleteReply}
                        userId={rep.userId}
                        user={rep.user}
                        id={id}
                    />
                ) : (
                    <Card
                        key={rep._id}
                        sx={{
                            p: "15px",
                            borderRadius: "12px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
                            },
                        }}
                    >
                        <Stack spacing={2} direction="row">
                            <Box sx={{ width: "100%" }}>
                                <Stack
                                    spacing={2}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack spacing={2} direction="row" alignItems="center">
                                        <Avatar
                                            src={rep.user?.avatar}
                                            alt={username}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                                                transition: "transform 0.3s ease",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                        />
                                        <Typography fontWeight="bold" sx={{ color: "neutral.darkBlue" }}>
                                            {username}
                                        </Typography>
                                        <Typography sx={{ color: "neutral.grayishBlue" }}>
                                            {createdData}
                                        </Typography>
                                    </Stack>
                                    {authUser && (
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                setReply(rep);
                                                setClicked(!clicked);
                                            }}
                                            sx={{
                                                fontWeight: 500,
                                                textTransform: "capitalize",
                                                color: "custom.moderateBlue",
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    color: "custom.darkBlue",
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                            startIcon={<img src={replyArrow} alt="reply sign" />}
                                        >
                                            {t("repliesSection.replyButton")}
                                        </Button>
                                    )}
                                </Stack>

                                <Typography
                                    component="div"
                                    sx={{
                                        color: "neutral.grayishBlue",
                                        p: "20px 0",
                                        animation: "fadeSlide 0.5s ease",
                                        "@keyframes fadeSlide": {
                                            from: { opacity: 0, transform: "translateY(20px)" },
                                            to: { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "custom.moderateBlue",
                                            width: "fit-content",
                                            fontWeight: 500,
                                            display: "inline-block",
                                        }}
                                    >
                                        {`@${answerToUser || onTar}`} {t("repliesSection.repliesTo")}
                                    </Typography>{" "}
                                    {reply}
                                </Typography>
                            </Box>
                        </Stack>
                    </Card>
                );
            })}

            {onClicked ? <AddReply onAdd={addReply} setClicked={clickedFun} /> : null}
            {clicked ? <AddReply onAdd={addReply} setClicked={setClicked} /> : null}
        </Stack>
    );
};

export default RepliesSection;