"use strict";
exports.ids = ["117"];
exports.modules = {
8476(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
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
                id: "development",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#development",
                        children: "#"
                    }),
                    "Development"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "prerequisites",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#prerequisites",
                        children: "#"
                    }),
                    "Prerequisites"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.ul, {
                children: [
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "Rust 1.85+"
                    }),
                    "\n",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.li, {
                        children: "Cargo"
                    }),
                    "\n"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "building",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#building",
                        children: "#"
                    }),
                    "Building"
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
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                            className: "line",
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-function)"
                                    },
                                    children: "cargo"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " build"
                                })
                            ]
                        })
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "testing",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#testing",
                        children: "#"
                    }),
                    "Testing"
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
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                            className: "line",
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-function)"
                                    },
                                    children: "cargo"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " test"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --all-features"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --locked"
                                })
                            ]
                        })
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "formatting",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#formatting",
                        children: "#"
                    }),
                    "Formatting"
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
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                            className: "line",
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-function)"
                                    },
                                    children: "cargo"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " fmt"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --all"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --check"
                                })
                            ]
                        })
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "linting",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#linting",
                        children: "#"
                    }),
                    "Linting"
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
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                            className: "line",
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-function)"
                                    },
                                    children: "cargo"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " clippy"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --all-targets"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --all-features"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --locked"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " -D"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " warnings"
                                })
                            ]
                        })
                    })
                })
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
            (0,react_jsx_runtime__rspack_import_0.jsx)(react_jsx_runtime__rspack_import_0.Fragment, {
                children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.pre, {
                    className: "shiki css-variables",
                    style: {
                        backgroundColor: "var(--shiki-background)",
                        color: "var(--shiki-foreground)"
                    },
                    tabIndex: "0",
                    lang: "bash",
                    children: (0,react_jsx_runtime__rspack_import_0.jsx)(_components.code, {
                        children: (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.span, {
                            className: "line",
                            children: [
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-foreground)"
                                    },
                                    children: "RUSTDOCFLAGS"
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
                                    children: "\"-D warnings\""
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-function)"
                                    },
                                    children: " cargo"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " doc"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --all-features"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --no-deps"
                                }),
                                (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                    style: {
                                        color: "var(--shiki-token-string)"
                                    },
                                    children: " --locked"
                                })
                            ]
                        })
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "complete-verification",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#complete-verification",
                        children: "#"
                    }),
                    "Complete Verification"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsx)(_components.p, {
                children: "Run the complete local verification set:"
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
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: "cargo"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " fmt"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --check"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-punctuation)"
                                        },
                                        children: " &&"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " \\"
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
                                        children: "cargo"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " check"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-targets"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-features"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --locked"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-punctuation)"
                                        },
                                        children: " &&"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " \\"
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
                                        children: "cargo"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " clippy"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-targets"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-features"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --locked"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " -D"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " warnings"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-punctuation)"
                                        },
                                        children: " &&"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " \\"
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
                                        children: "cargo"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " test"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-features"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --locked"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-punctuation)"
                                        },
                                        children: " &&"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-foreground)"
                                        },
                                        children: " \\"
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
                                        children: "RUSTDOCFLAGS"
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
                                        children: "\"-D warnings\""
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-function)"
                                        },
                                        children: " cargo"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " doc"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --all-features"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --no-deps"
                                    }),
                                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.span, {
                                        style: {
                                            color: "var(--shiki-token-string)"
                                        },
                                        children: " --locked"
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.h2, {
                id: "contributing",
                children: [
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        className: "rp-header-anchor",
                        "aria-hidden": "true",
                        href: "#contributing",
                        children: "#"
                    }),
                    "Contributing"
                ]
            }),
            "\n",
            (0,react_jsx_runtime__rspack_import_0.jsxs)(_components.p, {
                children: [
                    "Please see ",
                    (0,react_jsx_runtime__rspack_import_0.jsx)(_components.a, {
                        href: "https://github.com/lazhenyi/behest/blob/main/CONTRIBUTING.md",
                        rel: "noopener noreferrer",
                        target: "_blank",
                        children: "CONTRIBUTING.md"
                    }),
                    " for details."
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
MDXContent.__RSPRESS_PAGE_META["en%2Fdevelopment.md"] = {
    "toc": [
        {
            "id": "prerequisites",
            "text": "Prerequisites",
            "depth": 2
        },
        {
            "id": "building",
            "text": "Building",
            "depth": 2
        },
        {
            "id": "testing",
            "text": "Testing",
            "depth": 2
        },
        {
            "id": "formatting",
            "text": "Formatting",
            "depth": 2
        },
        {
            "id": "linting",
            "text": "Linting",
            "depth": 2
        },
        {
            "id": "documentation",
            "text": "Documentation",
            "depth": 2
        },
        {
            "id": "complete-verification",
            "text": "Complete Verification",
            "depth": 2
        },
        {
            "id": "contributing",
            "text": "Contributing",
            "depth": 2
        },
        {
            "id": "license",
            "text": "License",
            "depth": 2
        }
    ],
    "title": "Development",
    "headingTitle": "Development",
    "frontmatter": {}
};


},

};
;