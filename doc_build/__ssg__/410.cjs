"use strict";
exports.ids = ["410"];
exports.modules = {
3361(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (MDXContent)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__(1684);
/* import */ var _mdx_js_react__rspack_import_1 = __webpack_require__(506);


function _createMdxContent(props) {
    const _components = {
        a: "a",
        code: "code",
        h1: "h1",
        h2: "h2",
        h3: "h3",
        li: "li",
        p: "p",
        pre: "pre",
        span: "span",
        ul: "ul",
        ...(0,_mdx_js_react__rspack_import_1/* .useMDXComponents */.R)(),
        ...props.components
    };
    return (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
        children: [
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h1, {
                id: "架构",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#架构",
                        children: "#"
                    }),
                    "架构"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "运行时模型",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#运行时模型",
                        children: "#"
                    }),
                    "运行时模型"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "在运行时层，",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "AgentRuntime"
                    }),
                    " 编排完整的 agent 循环："
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(react_jsx_runtime__rspack_import_0.Fragment, {
                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.pre, {
                    className: "shiki css-variables",
                    style: {
                        backgroundColor: "var(--shiki-background)",
                        color: "var(--shiki-foreground)"
                    },
                    tabIndex: "0",
                    lang: "text",
                    children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.code, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "RunRequest"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 加载或创建会话"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 准入输入"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 构建上下文"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 调用模型提供商"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 流式/持久化助手输出"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 执行工具调用"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 追加工具结果"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 重复直到完成、限制或错误"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> 发射 AgentEvent 值"
                                })
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "运行时将以下组件整合在一起："
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ProviderRegistry"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ContextPipeline"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ToolRuntime"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "RuntimeStore"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "RuntimePolicy"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "CompactionService"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "SessionGate"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "可选事件发布器"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "可选快照存储"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "可选后台任务池"
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "错误模型",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#错误模型",
                        children: "#"
                    }),
                    "错误模型"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "behest"
                    }),
                    " 暴露类型化的错误类别，而不是字符串化的框架失败："
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ProviderError"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ToolError"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "StorageError"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "ContextError"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "RuntimeError"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            "顶级 ",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                children: "Error"
                            })
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            "crate 级别 ",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                children: "Result<T>"
                            })
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "提供商错误区分不支持的能力、可重试失败、传输失败、无效响应和适配器特定错误。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "工具错误区分缺失工具、无效参数、执行失败、超时和未实现的外部工具。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "lint-策略",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#lint-策略",
                        children: "#"
                    }),
                    "Lint 策略"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "crate 有意保持严格："
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "unsafe_code = \"forbid\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "missing_docs = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "unreachable_pub = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "clippy::all = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "dbg_macro = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "expect_used = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "todo = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "unimplemented = \"deny\""
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                            children: "unwrap_used = \"deny\""
                        })
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "该项目将公共 API 清晰度和失败路径卫生视为运行时契约的一部分。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "设计原则",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#设计原则",
                        children: "#"
                    }),
                    "设计原则"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "类型安全优先",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#类型安全优先",
                        children: "#"
                    }),
                    "类型安全优先"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "所有公共 API 都使用强类型，避免字符串化配置或动态分发（除非必要）。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "显式错误",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#显式错误",
                        children: "#"
                    }),
                    "显式错误"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "错误类型明确区分不同的失败模式，使调用者能够适当响应。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "可组合性",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#可组合性",
                        children: "#"
                    }),
                    "可组合性"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "组件通过 trait 抽象，允许替换和扩展，而无需修改核心逻辑。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "最小公共表面",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#最小公共表面",
                        children: "#"
                    }),
                    "最小公共表面"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "公共 API 有意保持紧凑，隐藏实现细节，同时提供足够的灵活性。"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "另请参阅",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#另请参阅",
                        children: "#"
                    }),
                    "另请参阅"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/zh/providers.html",
                                children: "提供商"
                            }),
                            " - 提供商实现"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/zh/tools.html",
                                children: "工具"
                            }),
                            " - 工具运行时"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/zh/events.html",
                                children: "事件"
                            }),
                            " - 事件系统"
                        ]
                    }),
                    "\n"
                ]
            })
        ]
    });
}
function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = {
        ...(0,_mdx_js_react__rspack_import_1/* .useMDXComponents */.R)(),
        ...props.components
    };
    return MDXLayout ? (0,react_jsx_runtime__rspack_import_0.jsx)(MDXLayout, {
        ...props,
        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_createMdxContent, {
            ...props
        })
    }) : _createMdxContent(props);
}
MDXContent.__RSPRESS_PAGE_META = {};
MDXContent.__RSPRESS_PAGE_META["zh%2Farchitecture.md"] = {
    "toc": [
        {
            "id": "运行时模型",
            "text": "运行时模型",
            "depth": 2
        },
        {
            "id": "错误模型",
            "text": "错误模型",
            "depth": 2
        },
        {
            "id": "lint-策略",
            "text": "Lint 策略",
            "depth": 2
        },
        {
            "id": "设计原则",
            "text": "设计原则",
            "depth": 2
        },
        {
            "id": "类型安全优先",
            "text": "类型安全优先",
            "depth": 3
        },
        {
            "id": "显式错误",
            "text": "显式错误",
            "depth": 3
        },
        {
            "id": "可组合性",
            "text": "可组合性",
            "depth": 3
        },
        {
            "id": "最小公共表面",
            "text": "最小公共表面",
            "depth": 3
        },
        {
            "id": "另请参阅",
            "text": "另请参阅",
            "depth": 2
        }
    ],
    "title": "架构",
    "headingTitle": "架构",
    "frontmatter": {}
};


},

};
;