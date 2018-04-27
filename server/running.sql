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

 Date: 27/04/2018 16:52:48
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
  PRIMARY KEY (`answerId`) USING BTREE,
  INDEX `删除评论`(`planId`) USING BTREE,
  CONSTRAINT `删除评论` FOREIGN KEY (`planId`) REFERENCES `running_plan` (`planId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of running_answer
-- ----------------------------
INSERT INTO `running_answer` VALUES (3, 111131, '评论还是的需要多测试的', 1524366456, 127);
INSERT INTO `running_answer` VALUES (4, 111131, '让我多测试几次啊', 1524368314, 126);
INSERT INTO `running_answer` VALUES (5, 111131, '再来一个评论呢？', 1524369065, 127);
INSERT INTO `running_answer` VALUES (6, 111131, '你的确实在逗我吧', 1524369184, 127);
INSERT INTO `running_answer` VALUES (7, 111131, '测试一次刷新', 1524369291, 127);
INSERT INTO `running_answer` VALUES (8, 111131, '时间戳', 1524369376, 126);
INSERT INTO `running_answer` VALUES (9, 111131, '真的是麻烦', 1524369410, 126);
INSERT INTO `running_answer` VALUES (10, 111131, '我特么不会还需要删除本记录吧', 1524369456, 127);
INSERT INTO `running_answer` VALUES (11, 111131, '看到还是很头疼', 1524369790, 126);
INSERT INTO `running_answer` VALUES (12, 111131, '12312312313123123', 1524369977, 127);
INSERT INTO `running_answer` VALUES (14, 111132, '???? ', 1524384090, 127);
INSERT INTO `running_answer` VALUES (17, 111131, '我们多测试两下', 1524403945, 147);
INSERT INTO `running_answer` VALUES (18, 111131, 'dfsasdfdf', 1524408013, 148);
INSERT INTO `running_answer` VALUES (19, 111131, 'fasdasdfsdafasd', 1524408023, 148);
INSERT INTO `running_answer` VALUES (20, 111131, 'hhhhh', 1524452996, 148);
INSERT INTO `running_answer` VALUES (21, 111131, 'asdfasdf', 1524453015, 148);
INSERT INTO `running_answer` VALUES (22, 111132, '这是吴黎明的回复', 1524453015, 148);
INSERT INTO `running_answer` VALUES (23, 111131, '可以撒', 1524455863, 148);
INSERT INTO `running_answer` VALUES (24, 111132, '我来一个骚操作', 1524458948, 154);
INSERT INTO `running_answer` VALUES (25, 111131, '我回复一条你怎么说', 1524461626, 156);
INSERT INTO `running_answer` VALUES (26, 111131, '妈也  是真的很气', 1524463224, 146);
INSERT INTO `running_answer` VALUES (27, 111131, '好吧尽快汇款', 1524489130, 128);
INSERT INTO `running_answer` VALUES (28, 111131, '试一试', 1524492890, 157);
INSERT INTO `running_answer` VALUES (29, 111131, '难受啊', 1524552215, 157);

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
) ENGINE = InnoDB AUTO_INCREMENT = 111135 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of running_followed
-- ----------------------------
INSERT INTO `running_followed` VALUES (111131, '111132,', ',');
INSERT INTO `running_followed` VALUES (111132, ',', '111131,');
INSERT INTO `running_followed` VALUES (111133, NULL, NULL);
INSERT INTO `running_followed` VALUES (111134, NULL, NULL);

-- ----------------------------
-- Table structure for running_plan
-- ----------------------------
DROP TABLE IF EXISTS `running_plan`;
CREATE TABLE `running_plan`  (
  `planId` int(11) NOT NULL AUTO_INCREMENT COMMENT '首页发布的消息ID',
  `id` int(11) NOT NULL COMMENT '发布者的ID号',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '约跑内容',
  `contentPic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '约跑的图片',
  `planAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '//约跑地址',
  `date` int(11) NULL DEFAULT NULL COMMENT '约跑时间',
  `goodFans` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '点赞的人数',
  PRIMARY KEY (`planId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 158 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of running_plan
-- ----------------------------
INSERT INTO `running_plan` VALUES (126, 111132, '谁有我帅?', 'https://itliming.cn/uploads/20180420/ea542086d61d53f0c0dc12fd69447bf1.jpg,https://itliming.cn/uploads/20180420/a256b23022da7bad0ebfb586484845e4.jpg,https://itliming.cn/uploads/20180420/43b776d13243aa4305090bd75f004ccc.jpg,', '重庆市沙坪坝区凤天大道8号', 1524227379, '111131,');
INSERT INTO `running_plan` VALUES (127, 111131, '辅导教师可根据撒几个圣诞节啊老公', 'https://itliming.cn/uploads/20180421/724d3776b5a18c0b857efc6fb8a4f8e0.png,https://itliming.cn/uploads/20180421/9cd3a4888a87924ddc33591f72ca395e.png,https://itliming.cn/uploads/20180421/ec368a21601bdb68b9d2ddeca71aadf1.png,https://itliming.cn/uploads/20180421/149eccd5a4d303f20df8ba5793bbc644.png,https://itliming.cn/uploads/20180421/9b889b2e41998059dae463b9f7d96977.png,', '重庆市渝中区轨道交通2号线', 1524289213, '111131,111132,');
INSERT INTO `running_plan` VALUES (128, 111132, '我又来一个。', 'https://itliming.cn/uploads/20180422/34d0a7db0d08cb988dd9818082c4a5b3.jpg,', '重庆师范大学大学城校区清风苑(沙坪坝区)', 1524384662, '111131,111132,');
INSERT INTO `running_plan` VALUES (129, 111131, '又来发布一个消息', 'https://itliming.cn/uploads/20180422/75c1e3268774174bb3405469a02cd623.png,https://itliming.cn/uploads/20180422/33bf42952243ab541da67e17d7f06b20.png,https://itliming.cn/uploads/20180422/1f05bdabae235a061bc3a5a0ecee8272.png,https://itliming.cn/uploads/20180422/6c9c87ba2ee8b02b872b2b0a1057dd55.png,https://itliming.cn/uploads/20180422/089d81e36b7fbefc8086d8c0feaff100.png,', '重庆市沙坪坝区天马路99-12', 1524401522, '111131,');
INSERT INTO `running_plan` VALUES (146, 111131, '1323', NULL, '请选择约跑地点', 1524403792, NULL);
INSERT INTO `running_plan` VALUES (147, 111131, '131231', 'https://itliming.cn/uploads/20180422/b7a8845cdd0efe28c0a42d97427a4ee6.png,', '请选择约跑地点', 1524403898, NULL);
INSERT INTO `running_plan` VALUES (148, 111131, 'asdf', NULL, '请选择约跑地点', 1524407852, '111131,');
INSERT INTO `running_plan` VALUES (149, 111131, '这些都是来测试的', NULL, '请选择约跑地点', 1524456542, NULL);
INSERT INTO `running_plan` VALUES (150, 111131, '哈哈哈哈哈哈哈哈哈哈', NULL, '请选择约跑地点', 1524456550, NULL);
INSERT INTO `running_plan` VALUES (151, 111131, '请把这个bug解决完吧', NULL, '请选择约跑地点', 1524456563, NULL);
INSERT INTO `running_plan` VALUES (152, 111131, '呵呵发多少咖啡机看来你街坊邻居、；分了就爱上', NULL, '请选择约跑地点', 1524456572, NULL);
INSERT INTO `running_plan` VALUES (153, 111131, '发撒酒疯考虑时间的空间；对方空间的；了解多少；风景；氨分解；六十几分； 接口', NULL, '请选择约跑地点', 1524456582, NULL);
INSERT INTO `running_plan` VALUES (154, 111131, '放声大哭封建礼教；看见速度快V家；坚持住；v;ljxzj；滤镜撒了；舰队司令； 健康拉升', NULL, '请选择约跑地点', 1524456590, NULL);
INSERT INTO `running_plan` VALUES (155, 111132, '吴黎明大帅哥，???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ????  吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥吴黎明大帅哥', 'https://itliming.cn/uploads/20180423/00d4de0a3a2c63909dc436444aeb6e5f.jpg,https://itliming.cn/uploads/20180423/e057444d0109eb0d2a2c3bf2de50fb10.jpg,', '请选择约跑地点', 1524460442, NULL);
INSERT INTO `running_plan` VALUES (156, 111132, '哈哈？', NULL, '请选择约跑地点', 1524460755, '');
INSERT INTO `running_plan` VALUES (157, 111131, '31231312313123', 'https://itliming.cn/uploads/20180423/a4f230b022379086e250d6f51ac4ed47.png,https://itliming.cn/uploads/20180423/2d0b821f4bc3ef7951e8dbd86019f73a.png,https://itliming.cn/uploads/20180423/2045528289da7ce8ecd6454e887c48c6.png,https://itliming.cn/uploads/20180423/d0c416481a7b729bf36200c3843a1107.png,https://itliming.cn/uploads/20180423/cee0509250823de0d96727b5bd40e772.png,https://itliming.cn/uploads/20180423/03bd7237fbe3957d8c1d3f3bb92fdf65.png,https://itliming.cn/uploads/20180423/c2559366b4ab413c5ea24e36066a712f.png,https://itliming.cn/uploads/20180423/d6e5e40cfd9f537d4a1f4613c804527a.png,https://itliming.cn/uploads/20180423/457195b2a26e2b27ba6863a91ab19c79.png,', '请选择约跑地点', 1524464287, NULL);

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
  PRIMARY KEY (`replyId`) USING BTREE,
  INDEX `删除`(`answerId`) USING BTREE,
  CONSTRAINT `删除` FOREIGN KEY (`answerId`) REFERENCES `running_answer` (`answerId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of running_reply
-- ----------------------------
INSERT INTO `running_reply` VALUES (1, 111131, 111131, 5, '这是一个子评论', 1524380424);
INSERT INTO `running_reply` VALUES (2, 111131, 111132, 4, '打发士大夫', NULL);
INSERT INTO `running_reply` VALUES (3, 111131, 111131, 17, 'fasdasdfdsfd', 1524405966);
INSERT INTO `running_reply` VALUES (4, 111131, 111132, 17, 'wofefefffffff', NULL);
INSERT INTO `running_reply` VALUES (5, 111131, 111131, 18, '..............', 1524408092);
INSERT INTO `running_reply` VALUES (6, 111131, 111131, 18, '123', 1524408175);
INSERT INTO `running_reply` VALUES (7, 111131, 111131, 20, '这是一条子评论', 1524453073);
INSERT INTO `running_reply` VALUES (8, 111131, 111131, 20, '再来一条字评论', 1524453098);
INSERT INTO `running_reply` VALUES (9, 111131, 111131, 20, '我要是回复很多很多呢，你说会不会换行呢？', 1524453200);
INSERT INTO `running_reply` VALUES (10, 111132, 111131, 21, '这是一个测试的评论', 1524453200);
INSERT INTO `running_reply` VALUES (11, 111131, 111132, 21, '我也来回复一次你', 1524455580);
INSERT INTO `running_reply` VALUES (12, 111131, 111132, 22, '最骚的就是你', 1524455631);
INSERT INTO `running_reply` VALUES (13, 111131, 111132, 22, '再来一次评论', 1524455817);
INSERT INTO `running_reply` VALUES (14, 111131, 111132, 22, '我还要评论一次你', 1524455855);
INSERT INTO `running_reply` VALUES (15, 111132, 111131, 19, '哈哈', 1524459186);
INSERT INTO `running_reply` VALUES (16, 111131, 111132, 22, '你好', 1524489090);
INSERT INTO `running_reply` VALUES (17, 111132, 111131, 25, '哈哈？', 1524492909);
INSERT INTO `running_reply` VALUES (18, 111131, 111132, 25, '我也看不见', 1524492934);

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
) ENGINE = InnoDB AUTO_INCREMENT = 111135 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of running_user
-- ----------------------------
INSERT INTO `running_user` VALUES (111131, 'oGYL00GjoWZOey76GkaJ6tqDT1Sg', '余鸿靖', '15213710631', '1', '13412341', '重庆师范大学', 'WTdHOJcrtZqUiICzXGjl9Q==', 'https://itliming.cn/uploads/20180421/b072c7e0ce9c366ba5f8850236a017d7.png', '重庆九龙坡');
INSERT INTO `running_user` VALUES (111132, 'oGYL00NDsDRTBID3W2zxEomsDJDs', '吴黎明1', '', '1', '1514764800', '重庆师范大学', 'bi2oIWIdPMFnPg5I95peAQ==', 'https://itliming.cn/uploads/20180420/6369d210d204963c1d5a8c6347d013d8.png', '重庆沙坪坝');
INSERT INTO `running_user` VALUES (111133, 'oGYL00LjBHZG0PYOEHod7winana8', '、yao。', '', '1', '', '', 'QxAVMREMgdJXW0q4lLPncA==', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLtTXZic6S7Y5x8YH1Nl6jS5nZre9QjAk7UVdLPzicd7ibgYII0C6CMtL9KKexD4CkXar3DQibT4sN5kw/0', '重庆');
INSERT INTO `running_user` VALUES (111134, 'oGYL00Ims6BChNZv6YSY476ZyAnc', '浅浅', '', '0', '', '', 'pP/lqQtocdE7mkdpDOexpQ==', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJicoPJcetyJB3eCriaVcO92PZmNgwmh9iceu18M7ic5G65TdtQa4yL6dNAqJsK0RmYuiarLlZXyv4x39g/0', '');

-- ----------------------------
-- Triggers structure for table running_user
-- ----------------------------
DROP TRIGGER IF EXISTS `更新子表`;
delimiter ;;
CREATE TRIGGER `更新子表` AFTER INSERT ON `running_user` FOR EACH ROW insert into running_followed (id) VALUES ((select max(id) from running_user))
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
