"use strict";
exports.ids = ["748"];
exports.modules = {
9359(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
        ol: "ol",
        p: "p",
        pre: "pre",
        span: "span",
        strong: "strong",
        ul: "ul",
        ...(0,_mdx_js_react__rspack_import_1/* .useMDXComponents */.R)(),
        ...props.components
    };
    return (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
        children: [
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h1, {
                id: "configuration",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#configuration",
                        children: "#"
                    }),
                    "Configuration"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "AgentConfig"
                    }),
                    " supports layered configuration with multiple sources."
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "configuration-layers",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#configuration-layers",
                        children: "#"
                    }),
                    "Configuration Layers"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Configuration is loaded in the following order (later sources override earlier ones):"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ol, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Defaults"
                            }),
                            " - Built-in default values"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "File sources"
                            }),
                            " - TOML, JSON, or YAML configuration files"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Environment variables"
                            }),
                            " - Environment variables with a prefix"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Manual builder setters"
                            }),
                            " - Programmatic configuration"
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "basic-configuration",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#basic-configuration",
                        children: "#"
                    }),
                    "Basic Configuration"
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
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "with_file"
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
                                        children: "\"behest.toml\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: "with_env"
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
                                        children: "\"BEHEST\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: " runtime "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "into_runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ".await?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "configuration-file",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#configuration-file",
                        children: "#"
                    }),
                    "Configuration File"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "Create a ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "behest.toml"
                    }),
                    " file:"
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
                                    children: "[providers.openai]"
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
                                        children: "api_key "
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
                                        children: " \"env:OPENAI_API_KEY\""
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "model "
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
                                        children: " \"gpt-4\""
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
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "[providers.anthropic]"
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
                                        children: "api_key "
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
                                        children: " \"env:ANTHROPIC_API_KEY\""
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "model "
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
                                        children: " \"claude-3-sonnet-20240229\""
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
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "[runtime]"
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
                                        children: "max_tokens "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " 4096"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "temperature "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " 0.7"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "stream "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " true"
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
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "[storage]"
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
                                        children: "backend "
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
                                        children: " \"memory\""
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "# or for Redis:"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "# backend = \"redis\""
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "# url = \"env:REDIS_URL\""
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
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "[tools]"
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
                                        children: "enabled "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " true"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "max_concurrent "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " 10"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "environment-variables",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#environment-variables",
                        children: "#"
                    }),
                    "Environment Variables"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Use environment variables for sensitive data:"
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
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.code, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "export"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " BEHEST_PROVIDERS_OPENAI_API_KEY"
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
                                        children: "\"your-api-key\""
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
                                        children: "export"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " BEHEST_PROVIDERS_ANTHROPIC_API_KEY"
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
                                        children: "\"your-api-key\""
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
                                        children: "export"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " BEHEST_STORAGE_URL"
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
                                        children: "\"redis://localhost:6379\""
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "secret-indirection",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#secret-indirection",
                        children: "#"
                    }),
                    "Secret Indirection"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "Secrets can be loaded through ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "env:VAR_NAME"
                    }),
                    " indirection in configuration files:"
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
                                    children: "[providers.openai]"
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
                                        children: "api_key "
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
                                        children: " \"env:OPENAI_API_KEY\""
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "This will read the API key from the ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: "OPENAI_API_KEY"
                    }),
                    " environment variable."
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "builder-api",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#builder-api",
                        children: "#"
                    }),
                    "Builder API"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Use the builder API for programmatic configuration:"
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
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "with_provider"
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
                                        children: "\"openai\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ", "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "ProviderConfig"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " {"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "        api_key"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ":"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: " \"your-key\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "to_string"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(),"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "        model"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ":"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string-expression)"
                                        },
                                        children: " \"gpt-4\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "to_string"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(),"
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
                                        children: "        .."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "Default"
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
                                        children: "default"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "    })"
                                })
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
                                        children: "with_storage"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(StorageConfig"
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
                                        children: "Memory"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
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
                                        children: "with_runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "("
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "RuntimeConfig"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " {"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "        max_tokens"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ":"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " 4096"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ","
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "        temperature"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ":"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " 0"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-punctuation)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: "7"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ","
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "        stream"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ":"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-constant)"
                                        },
                                        children: " true"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ","
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "    })"
                                })
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
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "configuration-sources",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#configuration-sources",
                        children: "#"
                    }),
                    "Configuration Sources"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "file-sources",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#file-sources",
                        children: "#"
                    }),
                    "File Sources"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Support multiple file formats:"
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
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "with_file"
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
                                        children: "\"behest.toml\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-comment)"
                                        },
                                        children: "    // TOML"
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
                                        children: "with_file"
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
                                        children: "\"behest.json\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-comment)"
                                        },
                                        children: "    // JSON"
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
                                        children: "with_file"
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
                                        children: "\"behest.yaml\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-comment)"
                                        },
                                        children: "    // YAML"
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
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h3, {
                id: "environment-variables-1",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#environment-variables-1",
                        children: "#"
                    }),
                    "Environment Variables"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Load configuration from environment variables:"
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
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "with_env"
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
                                        children: "\"BEHEST\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-comment)"
                                        },
                                        children: "  // Prefix for all env vars"
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
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "complete-example",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#complete-example",
                        children: "#"
                    }),
                    "Complete Example"
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
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "#[tokio"
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
                                        children: "main]"
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
                                        children: "async"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: " fn"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " main"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "() "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "->"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " Result"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "<()> {"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "    // Load configuration"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "        ."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "with_file"
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
                                        children: "\"behest.toml\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: "        ."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "with_env"
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
                                        children: "\"BEHEST\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: "        ."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "    // Create runtime"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " runtime "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "into_runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ".await?"
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
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-comment)"
                                    },
                                    children: "    // Use runtime"
                                })
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    let"
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
                                        children: "\"gpt-4\""
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
                                        children: "        ."
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
                                        children: "\"Hello!\""
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
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "    let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " response "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "="
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " runtime"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "complete"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(request)"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: ".await?"
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
                            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                                className: "line",
                                children: [
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "    println!"
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
                                        children: "\"Response: {}\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ", response"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "message"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "."
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "content);"
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
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "    Ok"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "(())"
                                    })
                                ]
                            }),
                            "\n",
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                className: "line",
                                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "}"
                                })
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "default-configuration",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#default-configuration",
                        children: "#"
                    }),
                    "Default Configuration"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "If no configuration is provided, behest uses sensible defaults:"
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Provider"
                            }),
                            ": None (must be configured)"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Storage"
                            }),
                            ": In-memory"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Runtime"
                            }),
                            ": 4096 max tokens, 0.7 temperature, streaming enabled"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.strong, {
                                children: "Tools"
                            }),
                            ": Enabled, 10 max concurrent"
                        ]
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "validation",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#validation",
                        children: "#"
                    }),
                    "Validation"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Configuration is validated at build time. Invalid configuration will return an error:"
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
                                        children: "let"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " config "
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
                                        children: " AgentConfig"
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
                                        children: "builder"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
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
                                        children: "with_file"
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
                                        children: "\"invalid.toml\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ")"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
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
                                        children: "build"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: "()"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-keyword)"
                                        },
                                        children: "?"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: ";  "
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-comment)"
                                        },
                                        children: "// Returns error if configuration is invalid"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "see-also",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#see-also",
                        children: "#"
                    }),
                    "See Also"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/providers.html",
                                children: "Providers"
                            }),
                            " - Provider configuration"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/features.html",
                                children: "Features"
                            }),
                            " - Feature flags"
                        ]
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.li, {
                        children: [
                            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                                href: "/getting-started.html",
                                children: "Getting Started"
                            }),
                            " - Basic setup"
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
MDXContent.__RSPRESS_PAGE_META["en%2Fconfiguration.md"] = {
    "toc": [
        {
            "id": "configuration-layers",
            "text": "Configuration Layers",
            "depth": 2
        },
        {
            "id": "basic-configuration",
            "text": "Basic Configuration",
            "depth": 2
        },
        {
            "id": "configuration-file",
            "text": "Configuration File",
            "depth": 2
        },
        {
            "id": "environment-variables",
            "text": "Environment Variables",
            "depth": 2
        },
        {
            "id": "secret-indirection",
            "text": "Secret Indirection",
            "depth": 3
        },
        {
            "id": "builder-api",
            "text": "Builder API",
            "depth": 2
        },
        {
            "id": "configuration-sources",
            "text": "Configuration Sources",
            "depth": 2
        },
        {
            "id": "file-sources",
            "text": "File Sources",
            "depth": 3
        },
        {
            "id": "environment-variables-1",
            "text": "Environment Variables",
            "depth": 3
        },
        {
            "id": "complete-example",
            "text": "Complete Example",
            "depth": 2
        },
        {
            "id": "default-configuration",
            "text": "Default Configuration",
            "depth": 2
        },
        {
            "id": "validation",
            "text": "Validation",
            "depth": 2
        },
        {
            "id": "see-also",
            "text": "See Also",
            "depth": 2
        }
    ],
    "title": "Configuration",
    "headingTitle": "Configuration",
    "frontmatter": {}
};


},

};
;