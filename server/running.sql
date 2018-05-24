/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云
 Source Server Type    : MariaDB
 Source Server Version : 50556
 Source Host           : 123.206.255.185:3306
 Source Schema         : running

 Target Server Type    : MariaDB
 Target Server Version : 50556
 File Encoding         : 65001

 Date: 24/05/2018 21:24:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for running_answer
-- ----------------------------
DROP TABLE IF EXISTS `running_answer`;
CREATE TABLE `running_answer`  (
  `answerId` int(11) NOT NULL AUTO_INCREMENT COMMENT '//层主回复',
  `id` int(11) NOT NULL COMMENT '//层主id',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '//评论内容',
  `date` int(11) NULL DEFAULT NULL COMMENT '//评论时间',
  `planId` int(11) NULL DEFAULT NULL COMMENT '//回复的目标主题',
  `readFlag` int(1) NULL DEFAULT 1 COMMENT '//是否已读 1为未读，0为已读',
  PRIMARY KEY (`answerId`) USING BTREE,
  INDEX `删除评论`(`planId`) USING BTREE,
  CONSTRAINT `删除评论` FOREIGN KEY (`planId`) REFERENCES `running_plan` (`planId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for running_followed
-- ----------------------------
DROP TABLE IF EXISTS `running_followed`;
CREATE TABLE `running_followed`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id，标识是哪个用户',
  `followed` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '我关注的用户，我关注的用户唯一id列表',
  `beFollowed` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '我被哪些用户关注，关注我的用户唯一id列表',
  PRIMARY KEY (`id`) USING BTREE,
  CONSTRAINT `running_followed_ibfk_1` FOREIGN KEY (`id`) REFERENCES `running_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 111138 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for running_plan
-- ----------------------------
DROP TABLE IF EXISTS `running_plan`;
CREATE TABLE `running_plan`  (
  `planId` int(11) NOT NULL AUTO_INCREMENT COMMENT '//首页发布的消息ID',
  `id` int(11) NOT NULL COMMENT '//发布者的ID号',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '//约跑内容',
  `contentPic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '//约跑的图片',
  `planAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '//约跑地址',
  `date` int(11) NULL DEFAULT NULL COMMENT '//约跑时间',
  `goodFans` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '//点赞的人数',
  `readFlag` int(1) NULL DEFAULT 0 COMMENT '//是否又有新人点赞。0为没有，1为有',
  PRIMARY KEY (`planId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 162 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for running_reply
-- ----------------------------
DROP TABLE IF EXISTS `running_reply`;
CREATE TABLE `running_reply`  (
  `replyId` int(11) NOT NULL AUTO_INCREMENT COMMENT '//其他子评论',
  `id` int(11) NULL DEFAULT NULL COMMENT '//回复人的ID',
  `replyUserId` int(11) NULL DEFAULT NULL COMMENT '//回复目标的ID',
  `answerId` int(11) NULL DEFAULT NULL COMMENT '//那一层的索引',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '//评论内容',
  `date` int(11) NULL DEFAULT NULL COMMENT '//回复时间',
  `readFlag` int(1) NULL DEFAULT 1 COMMENT '//回复的内容是否已经读取过了，1未读，0读了',
  PRIMARY KEY (`replyId`) USING BTREE,
  INDEX `删除`(`answerId`) USING BTREE,
  CONSTRAINT `删除` FOREIGN KEY (`answerId`) REFERENCES `running_answer` (`answerId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for running_run
-- ----------------------------
DROP TABLE IF EXISTS `running_run`;
CREATE TABLE `running_run`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `runtime` double NULL DEFAULT NULL COMMENT '用时，分钟',
  `who` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '谁的跑步记录',
  `kilometer` double NULL DEFAULT NULL COMMENT '里程，千米',
  `time` int(11) NULL DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for running_user
-- ----------------------------
DROP TABLE IF EXISTS `running_user`;
CREATE TABLE `running_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '每个用户的唯一id，自动递增，主键',
  `openId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '每个用户的唯一openId，用来标识用户',
  `nickName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '昵称',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '电话号码',
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '0' COMMENT '性别 1男 2女 0保密',
  `dateOfBirth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '用户出生日期~时间戳~可以算 年龄、生日',
  `school` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '学校',
  `token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录后验证码',
  `avatarUrl` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'http://tx.haiqq.com/uploads/allimg/170505/10411W433-0.jpg' COMMENT '头像url',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '地址',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 111138 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Triggers structure for table running_user
-- ----------------------------
DROP TRIGGER IF EXISTS `更新子表`;
delimiter ;;
CREATE TRIGGER `更新子表` AFTER INSERT ON `running_user` FOR EACH ROW insert into running_followed (id) VALUES ((select max(id) from running_user))
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
