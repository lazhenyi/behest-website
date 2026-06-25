"use strict";
exports.ids = ["647"];
exports.modules = {
5018(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
                id: "architecture",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#architecture",
                        children: "#"
                    }),
                    "Architecture"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "runtime-model",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#runtime-model",
                        children: "#"
                    }),
                    "Runtime Model"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "At the runtime layer, ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "AgentRuntime"
                    }),
                    " orchestrates the full agent loop:"
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
                                    children: "  -> load or create session"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> admit input"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> build context"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> call model provider"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> stream / persist assistant output"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> execute tool calls"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> append tool results"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> repeat until completion, limit, or error"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    children: "  -> emit AgentEvent values"
                                })
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "The runtime brings together:"
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
                        children: "optional event publisher"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "optional snapshot store"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "optional background job pool"
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "error-model",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#error-model",
                        children: "#"
                    }),
                    "Error Model"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "behest"
                    }),
                    " exposes typed error categories instead of stringly framework failures:"
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
                            "top-level ",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                children: "Error"
                            })
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            "crate-level ",
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
                children: "Provider errors distinguish unsupported capabilities, retryable failures, transport failures, invalid responses, and adapter-specific errors."
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Tool errors distinguish missing tools, invalid arguments, execution failures, timeouts, and unimplemented external tools."
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "lint-policy",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#lint-policy",
                        children: "#"
                    }),
                    "Lint Policy"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "The crate is intentionally strict:"
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
                children: "This project treats public API clarity and failure-path hygiene as part of the runtime contract."
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
MDXContent.__RSPRESS_PAGE_META["en%2Farchitecture.md"] = {
    "toc": [
        {
            "id": "runtime-model",
            "text": "Runtime Model",
            "depth": 2
        },
        {
            "id": "error-model",
            "text": "Error Model",
            "depth": 2
        },
        {
            "id": "lint-policy",
            "text": "Lint Policy",
            "depth": 2
        }
    ],
    "title": "Architecture",
    "headingTitle": "Architecture",
    "frontmatter": {}
};


},

};
;