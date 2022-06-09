import { baseUrl } from "config/baseUrl";
import { GetServerSideProps, NextPage } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import React from "react";
import { ArticleInfo, InfoResponse } from "../../config/type";
import {
  Box,
  useColorMode,
  Flex,
  Avatar,
  Text,
  Image,
} from "@chakra-ui/react";
import rehypePrism from "rehype-prism-plus";
import { H1, H2, H3, H4, H5, H6 } from "markdown/Heading";
import Paragraph from "markdown/Paragraph";
import { OrderListItem, OrderList, UnOrderList } from "markdown/OrderList";
import codesandbox from "remark-codesandbox";
import embedIamge from "remark-embed-images";
import extendedTable from "remark-extended-table";
import reamrkTypescript from "remark-typescript";
import directive from "remark-directive";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import Toc from "markdown/Toc";
import { shadows } from "config/theme";
import moment from "moment";
import { PrismDarkTheme, PrismLightTheme } from "../../styles/PrismTheme";
import CodeSandBox from "markdown/CodeSandBox";
import Code from "markdown/Code";
import Comment from "components/Comment";

const ArticleDetail: NextPage<{
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  info: ArticleInfo;
}> = ({ source, info }) => {
  const { colorMode } = useColorMode();
  return (
    <Box bg={colorMode === "light" ? "#f9f9f9" : undefined} pt={"80px"}>
      <Box
        width="55vw"
        ml={"13vw"}
        bg={colorMode === "light" ? "#fff" : undefined}
        boxShadow={shadows[colorMode]}
        padding={"16px 24px"}
      >
        <H1>{info.title}</H1>
        <Flex justify={"space-between"}>
          <Flex>
            <Avatar src={info.avatarUrl} />
            <Flex
              flexDir={"column"}
              justify={"space-between"}
              ml={"16px"}
              mb={"16px"}
              height={"48px"}
            >
              <Text fontSize={"18px"} fontWeight={"700"}>
                {info.author}
              </Text>
              <Flex>
                <Text fontSize={"12px"}>
                  {moment.utc(info.date).format("YYYY年MM月DD日 hh:mm")}
                </Text>
                <Text fontSize={"12px"} ml={"16px"}>
                  {info.views} 阅读
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Image
          src={info.coverImage}
          style={{ width: "100%", aspectRatio: "5 / 3" }}
          alt=""
          mb={"24px"}
        />
        {colorMode === 'dark' ? <PrismDarkTheme>
          <MDXRemote
            {...source}
            components={{
              h1: H1,
              h2: H2,
              h3: H3,
              h4: H4,
              h5: H5,
              h6: H6,
              p: Paragraph,
              nav: Toc,
              CodeSandBox,
              ol: OrderList,
              li: OrderListItem,
              ul: UnOrderList,
              code: Code,
            }}
          />
        </PrismDarkTheme> : <PrismLightTheme>
          <MDXRemote
            {...source}
            components={{
              h1: H1,
              h2: H2,
              h3: H3,
              h4: H4,
              h5: H5,
              h6: H6,
              p: Paragraph,
              nav: Toc,
              CodeSandBox,
              ol: OrderList,
              li: OrderListItem,
              ul: UnOrderList,
              code: Code,
            }}
          />
        </PrismLightTheme>}
        <Comment />
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const res = await fetch(`${baseUrl}/api/post/${query.id}`);
  const data: InfoResponse = await res.json();
  const mdxSource = await serialize(data.info.content, {
    mdxOptions: {
      remarkPlugins: [
        [codesandbox, { mode: "button" }],
        embedIamge,
        extendedTable,
        reamrkTypescript,
        directive,
        remarkGfm,
      ],
      rehypePlugins: [
        rehypePrism,
        rehypeAutolinkHeadings,
        slug,
        [toc, { tight: false }],
      ],
      format: "mdx",
    },
  });
  data.info.content = "";
  return { props: { source: mdxSource, info: data.info } };
};

export default ArticleDetail;
