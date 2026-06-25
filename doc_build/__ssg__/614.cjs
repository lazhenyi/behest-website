"use strict";
exports.ids = ["614"];
exports.modules = {
2757(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (MDXContent)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__(1684);
/* import */ var _mdx_js_react__rspack_import_1 = __webpack_require__(506);


function _createMdxContent(props) {
    const _components = {
        a: "a",
        blockquote: "blockquote",
        code: "code",
        em: "em",
        h1: "h1",
        h2: "h2",
        hr: "hr",
        img: "img",
        li: "li",
        p: "p",
        pre: "pre",
        span: "span",
        strong: "strong",
        table: "table",
        tbody: "tbody",
        td: "td",
        th: "th",
        thead: "thead",
        tr: "tr",
        ul: "ul",
        ...(0,_mdx_js_react__rspack_import_1/* .useMDXComponents */.R)(),
        ...props.components
    };
    return (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
        children: [
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h1, {
                id: "behest",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#behest",
                        children: "#"
                    }),
                    "behest"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                    children: "Rust-native building blocks for production AI agent runtimes"
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        href: "https://github.com/lazhenyi/behest/actions/workflows/ci.yml",
                        rel: "noopener noreferrer",
                        target: "_blank",
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.img, {
                            src: "https://github.com/lazhenyi/behest/actions/workflows/ci.yml/badge.svg",
                            alt: "CI"
                        })
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        href: "#license",
                        children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.img, {
                            src: "https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg",
                            alt: "License: MIT OR Apache-2.0"
                        })
                    })
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.hr, {}),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "what-this-is",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#what-this-is",
                        children: "#"
                    }),
                    "What this is"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "behest"
                    }),
                    " provides provider-neutral contracts for chat, streaming, tool calling, embeddings, runtime execution, storage, queues, RAG, observability, and optional gRPC serving."
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "It is designed for systems that need explicit control over model providers, tool execution, persistence, and operational boundaries — instead of opaque \"agent framework\" magic."
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.blockquote, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                        children: "Status: early foundation crate. Public APIs are intentionally compact, strongly typed, and documented."
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "why-behest",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#why-behest",
                        children: "#"
                    }),
                    "Why behest"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                        children: "behest"
                    }),
                    " /bɪˈhest/ — ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.em, {
                        children: "n."
                    }),
                    " a person's orders or command."
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.blockquote, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                        children: [
                            "At the ",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "behest"
                            }),
                            " of the user, the agent acts."
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "The core of an agent runtime is not \"autonomous consciousness\" but controlled delegation: the user issues an intent, and the system composes context, invokes models, executes tools, persists state, publishes events within explicit boundaries — auditable, recoverable, constrainable, and replaceable."
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "The name ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "behest"
                    }),
                    " deliberately avoids inflated metaphors like \"brain / cognition / intelligence\". It only states an engineering fact:"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.blockquote, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                        children: "tool-calling, streaming, memory, queue, RAG, snapshot — all mechanisms exist because someone gave an order."
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "design-goals",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#design-goals",
                        children: "#"
                    }),
                    "Design goals"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Rust-native first"
                            }),
                            ": typed APIs, explicit errors, no hidden runtime assumptions."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Provider-neutral core"
                            }),
                            ": OpenAI, Anthropic, local models, proxies, or internal providers can implement the same contracts."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Streaming-first runtime"
                            }),
                            ": the agent loop is designed around streamed model events, with non-streaming fallback where appropriate."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Typed tool boundary"
                            }),
                            ": tools are described by JSON Schema and executed through explicit registries."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Pluggable persistence"
                            }),
                            ": memory by default, external stores behind feature flags."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Operational surface"
                            }),
                            ": event publishing, snapshots, session gates, compaction, retry policy, and optional gRPC server."
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Small public API"
                            }),
                            ": foundation primitives over framework sprawl."
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "quick-start",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#quick-start",
                        children: "#"
                    }),
                    "Quick start"
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
                    lang: "toml",
                    children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.code, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "[dependencies]"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "behest "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: " \"0.3\""
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Create a provider-neutral chat request:"
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
                    lang: "rust",
                    children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.code, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "use"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " behest"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "prelude"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::*"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line"
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " request "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " ChatRequest"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "new"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(ModelName"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "new"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "("
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: "\"example-model\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "))"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    ."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "with_message"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(Message"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "system_text"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "("
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: "\"You are concise.\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "))"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    ."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "with_user_text"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "("
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: "\"Summarize this project in one sentence.\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ");"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Register providers in a registry and route requests:"
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
                    lang: "rust",
                    children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.code, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "use"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " behest"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "prelude"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::*"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line"
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " registry "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " ProviderRegistry"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "new"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "();"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " provider_id "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " ProviderId"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "::"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "new"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "("
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: "\"my-provider\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ");"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line"
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "// Register a ChatProvider implementation first."
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "// registry.register_chat(my_provider);"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line"
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "// Then route through the neutral registry."
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "// let response = registry.complete(&provider_id, request).await?;"
                                })
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "whats-inside",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#whats-inside",
                        children: "#"
                    }),
                    "What's inside"
                ]
            }),
            "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.table, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.thead, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.th, {
                                    children: "Area"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.th, {
                                    children: "Capability"
                                })
                            ]
                        })
                    }),
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tbody, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Provider contracts"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.td, {
                                        children: [
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "ChatProvider"
                                            }),
                                            ", ",
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "EmbeddingProvider"
                                            }),
                                            ", request / response models, stream events, provider capabilities"
                                        ]
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Provider registry"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "In-memory routing for chat and embedding providers"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Chat model types"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "messages, content parts, tool calls, response formats, token usage, finish reasons"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Tool runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.td, {
                                        children: [
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "Tool"
                                            }),
                                            ", ",
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "FunctionTool"
                                            }),
                                            ", ",
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "ExternalTool"
                                            }),
                                            ", ",
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "ToolRegistry"
                                            }),
                                            ", schema generation, execution dispatch"
                                        ]
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Agent runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "context building, model calls, tool loop, session persistence, event emission"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Runtime safety"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "session gate, runtime policy, input admission, doom-loop detection, tool output truncation"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Storage"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "memory stores, Redis, SQLx, MongoDB, SurrealDB, object storage, Qdrant embeddings"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Context and RAG"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "context adapters, static/function adapters, optional RAG adapter"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Queues"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "optional event publishing through NATS or Redis Streams"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Configuration"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "builder, file-based config, environment variable loading, secret indirection"
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Server"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.td, {
                                        children: [
                                            "optional gRPC server binary behind ",
                                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                                                children: "server"
                                            }),
                                            " feature"
                                        ]
                                    })
                                ]
                            }),
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.tr, {
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "Observability"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.td, {
                                        children: "tracing and optional OpenTelemetry integration"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "documentation",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#documentation",
                        children: "#"
                    }),
                    "Documentation"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/getting-started.html",
                                children: "Getting Started"
                            }),
                            " - Installation and basic usage"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/providers.html",
                                children: "Providers"
                            }),
                            " - Provider adapters and custom implementations"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/tools.html",
                                children: "Tools"
                            }),
                            " - Tool definition and execution"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/sessions.html",
                                children: "Sessions"
                            }),
                            " - Session management and conversation state"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/storage.html",
                                children: "Storage"
                            }),
                            " - Storage backends and persistence"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/configuration.html",
                                children: "Configuration"
                            }),
                            " - Configuration options and layers"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/error-handling.html",
                                children: "Error Handling"
                            }),
                            " - Typed error categories"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/examples.html",
                                children: "Examples"
                            }),
                            " - Practical code examples"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/architecture.html",
                                children: "Architecture"
                            }),
                            " - Runtime model and design"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/rag.html",
                                children: "RAG"
                            }),
                            " - Retrieval-Augmented Generation"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/events.html",
                                children: "Events"
                            }),
                            " - Event system and observability"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/features.html",
                                children: "Feature Flags"
                            }),
                            " - Available feature flags"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/api-reference.html",
                                children: "API Reference"
                            }),
                            " - Core types and traits"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/development.html",
                                children: "Development"
                            }),
                            " - Development setup and contribution guide"
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "license",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#license",
                        children: "#"
                    }),
                    "License"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Licensed under either of:"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "Apache License, Version 2.0"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "MIT license"
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "at your option."
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
MDXContent.__RSPRESS_PAGE_META["en%2Findex.md"] = {
    "toc": [
        {
            "id": "what-this-is",
            "text": "What this is",
            "depth": 2
        },
        {
            "id": "why-behest",
            "text": "Why behest",
            "depth": 2
        },
        {
            "id": "design-goals",
            "text": "Design goals",
            "depth": 2
        },
        {
            "id": "quick-start",
            "text": "Quick start",
            "depth": 2
        },
        {
            "id": "whats-inside",
            "text": "What's inside",
            "depth": 2
        },
        {
            "id": "documentation",
            "text": "Documentation",
            "depth": 2
        },
        {
            "id": "license",
            "text": "License",
            "depth": 2
        }
    ],
    "title": "behest",
    "headingTitle": "behest",
    "frontmatter": {}
};


},

};
;