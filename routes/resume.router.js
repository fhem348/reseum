import express from "express";
import { prisma } from "../models/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 이력서 생성 API **/
router.post("/resumes", authMiddleware, async (req, res, next) => {
  // 로그인된 사용자인지 검증하기 위해 중간에 authMW 추가
  const { title, status, Education, license, Experience, skill, history } =
    req.body;
  const { userId } = req.user;

  //   //   UserInfos 테이블도 가져오기
  const userInfos = await prisma.userInfos.findFirst({
    where: {
      userId: +userId,
    },
    select: {
      userInfoId: true,
    },
  });

  const userInfoId = userInfos?.userInfoId;

  const resume = await prisma.resumes.create({
    data: {
      userId: +userId,
      userInfoId: +userInfoId,
      title,
      status,
      Education,
      license,
      Experience,
      skill,
      history,
    },
  });

  return res.status(201).json({ data: resume });
});

router.get("/resumes", async (req, res, next) => {
  const resumes = await prisma.resumes.findMany({
    select: {
      resumeId: true,
      userId: true,
      userInfoId: true,
      title: true,
      status: true,
      UserInfos: {
        // 수정된 부분: userInfos -> UserInfos
        select: {
          profileImage: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc", // 이력서를 최신순으로 정렬합니다.
    },
  });

  return res.status(200).json({ data: resumes });
});

/** 이력서 상세 조회 API **/
router.get("/resumes/:resumeId", async (req, res, next) => {
  const { resumeId } = req.params;
  const resume = await prisma.resumes.findFirst({
    where: {
      resumeId: +resumeId,
    },
    select: {
      resumeId: true,
      userId: true,
      userInfoId: true,
      status: true,
      title: true,
      Education: true,
      license: true,
      Experience: true,
      skill: true,
      history: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: resume });
});

/** 이력서 수정 API **/
router.patch("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { title, status, Education, license, Experience, skill, history } =
      req.body;

    const updatedResume = await prisma.resumes.update({
      where: {
        resumeId: +resumeId,
      },
      data: {
        title,
        status,
        Education,
        license,
        Experience,
        skill,
        history,
      },
    });

    return res.status(200).json({ data: updatedResume });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res
      .status(500)
      .json({ error: "이력서를 업데이트하는 중에 오류가 발생했습니다." });
  }
});

router.delete("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    await prisma.resumes.delete({
      where: {
        resumeId: +resumeId,
      },
    });

    return res.status(200).json({ message: "이력서가 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res
      .status(500)
      .json({ error: "이력서를 삭제하는 중에 오류가 발생했습니다." });
  }
});

export default router;
