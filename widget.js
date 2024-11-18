/*! © 2018 SAP SE or an SAP affiliate company. All rights reserved. */
!function() {
    var e, a, t, r, i, o, n, s, p, l = {
        63: function(e, a, t) {
            "use strict";
            let r = () => {
                throw Error(`App Extension Framework is not supported in the current scope (${self.document ? "renderer thread" : "worker"}).`)
            }
              , i = () => {}
            ;
            t.pods = {
                manager: null,
                importModule: r,
                importExtensions: r,
                importResolvedExtensions: r,
                importExtension: r,
                exportModule: i,
                exportExtension: i,
                exportExtensionPoint: i
            }
        },
        414: function(e, a, t) {
            t.p = "../"
        },
        344: function(e, a) {
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.CompositionScoreArray = void 0,
            a.CompositionScoreArray = function() {
                function e() {
                    this.container = []
                }
                return e.prototype.add = function(e, a) {
                    this.container.push({
                        composition: e,
                        score: a
                    })
                }
                ,
                e.prototype.getSortedCompositions = function() {
                    return this.container.sort(function(e, a) {
                        return a.score - e.score
                    }),
                    this.container
                }
                ,
                e
            }()
        },
        1019: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(128);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(71);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(210);
                return n = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.DynamicKnowledgeBase = void 0,
            (s = p || (p = {})).write = "WRITE",
            s.upperLowerCase = "UPPER_LOWER_CASE",
            s.replace = "REPLACE";
            var s, p, l = /^\s+$/, u = new RegExp("^".concat(o().KnowledgeBaseFunctions.writeChar).concat(o().seperator, "[0-9]+$"));
            a.DynamicKnowledgeBase = function() {
                function e(e) {
                    this.knowledgeBase = {
                        WRITE: {},
                        UPPER_LOWER_CASE: {},
                        REPLACE: {}
                    },
                    this.examples = [],
                    this.examples.push(e),
                    this.currentInput = e.input,
                    this.currentOutput = e.output,
                    this.ki = new (i()).KnowledgeBaseInterpreter,
                    this.generateFunctions()
                }
                return e.prototype.getKnowledgeBaseClauses = function() {
                    return {
                        writeFunctions: this.getWriteClauses(),
                        upperLowerCaseFunctions: this.getUpperLowerCaseClauses()
                    }
                }
                ,
                e.prototype.getKnowledgeBaseClausesAsString = function() {
                    return {
                        writeFunctions: this.getWriteClausesAsString(),
                        upperLowerCaseFunctions: this.getUpperCaseLowerCaseClausesAsString()
                    }
                }
                ,
                e.prototype.getWriteClauses = function() {
                    return Object.values(this.knowledgeBase[p.write])
                }
                ,
                e.prototype.getUpperLowerCaseClauses = function() {
                    return Object.values(this.knowledgeBase[p.upperLowerCase])
                }
                ,
                e.prototype.getWriteClausesAsString = function() {
                    return Object.keys(this.knowledgeBase[p.write])
                }
                ,
                e.prototype.getUpperCaseLowerCaseClausesAsString = function() {
                    return Object.keys(this.knowledgeBase[p.upperLowerCase])
                }
                ,
                e.prototype.newIO = function(e) {
                    this.examples.push(e),
                    this.currentInput = e.input,
                    this.currentOutput = e.output,
                    this.generateFunctions()
                }
                ,
                e.prototype.generateFunctions = function() {
                    this.createWriteFunctions(),
                    this.createUpperLowerCaseFunctions()
                }
                ,
                e.prototype.addToKnowledgeBase = function(e, a) {
                    var t, i, n = "".concat(e.functionName);
                    try {
                        for (var s = (0,
                        r().__values)(e.params), c = s.next(); !c.done; c = s.next()) {
                            var f = c.value;
                            n += "".concat(o().seperator).concat(f)
                        }
                    } catch (e) {
                        t = {
                            error: e
                        }
                    } finally {
                        try {
                            c && !c.done && (i = s.return) && i.call(s)
                        } finally {
                            if (t)
                                throw t.error
                        }
                    }
                    if (a === p.write) {
                        var b = this.ki.execute([e], this.currentInput);
                        if ("" === b || -1 === this.currentOutput.toUpperCase().indexOf(b.toUpperCase()) || !u.test(n) && l.test(b))
                            return
                    }
                    this.knowledgeBase[a][n] || (this.knowledgeBase[a][n] = e)
                }
                ,
                e.prototype.createWriteFunctions = function() {
                    for (var e, a, t, i, n = p.write, s = this.currentInput.split(o().splitter), l = "", u = this.currentInput.replace(/\s/g, "").split(/[A-Za-z0-9_]/g).join("").split(""), c = 0; c < Math.ceil(s.length / 2); c++) {
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeFirstPlusXWord,
                            params: [c]
                        }, n),
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeLastMinusXWord,
                            params: [c]
                        }, n),
                        l = s[c];
                        for (var f = 0; f < Math.ceil(l.length / 2); f++)
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeFirstCharPlusXOfFirstWordPlusY,
                                params: [f, c]
                            }, n),
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeLastCharMinusXOfFirstWordPlusY,
                                params: [f, c]
                            }, n);
                        l = s[s.length - 1 - c];
                        for (var f = 0; f < Math.ceil(l.length / 2); f++)
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeFirstCharPlusXOfLastWordMinusY,
                                params: [f, c]
                            }, n),
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeLastCharMinusXOfLastWordMinusY,
                                params: [f, c]
                            }, n)
                    }
                    s = this.currentOutput.split(o().splitter);
                    try {
                        for (var b = (0,
                        r().__values)(s), m = b.next(); !m.done; m = b.next()) {
                            var g = m.value;
                            "" !== g && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.write,
                                params: [g]
                            }, n)
                        }
                    } catch (a) {
                        e = {
                            error: a
                        }
                    } finally {
                        try {
                            m && !m.done && (a = b.return) && a.call(b)
                        } finally {
                            if (e)
                                throw e.error
                        }
                    }
                    try {
                        for (var d = (0,
                        r().__values)(this.currentOutput), v = d.next(); !v.done; v = d.next()) {
                            var k = v.value;
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeChar,
                                params: [k.charCodeAt(0)]
                            }, n)
                        }
                    } catch (e) {
                        t = {
                            error: e
                        }
                    } finally {
                        try {
                            v && !v.done && (i = d.return) && i.call(d)
                        } finally {
                            if (t)
                                throw t.error
                        }
                    }
                    s = this.currentInput.split(o().splitter);
                    for (var c = 0; c < s.length; c++) {
                        0 !== c && (this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeBefore,
                            params: [s[c]]
                        }, n),
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                            params: [s[c]]
                        }, n)),
                        c !== s.length - 1 && (this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeAfter,
                            params: [s[c]]
                        }, n),
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                            params: [s[c]]
                        }, n));
                        for (var f = c + 1; f < s.length; f++)
                            this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeBetween,
                                params: [s[c], s[f]]
                            }, n),
                            c + 1 !== f && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                params: [s[c], s[f]]
                            }, n)
                    }
                    for (var c = 0; c < Math.ceil(u.length / 2); c++)
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeFirstSpecialCharPlusX,
                            params: [c]
                        }, n),
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.writeLastSpecialCharMinusX,
                            params: [c]
                        }, n)
                }
                ,
                e.prototype.createUpperLowerCaseFunctions = function() {
                    var e = p.upperLowerCase
                      , a = this.currentOutput.split(o().splitter)
                      , t = ""
                      , r = "";
                    if (this.currentOutput.toUpperCase() === this.currentOutput)
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.upperCaseAll,
                            params: []
                        }, e);
                    else if (this.currentOutput.toLowerCase() === this.currentOutput)
                        this.addToKnowledgeBase({
                            functionName: o().KnowledgeBaseFunctions.lowerCaseAll,
                            params: []
                        }, e);
                    else {
                        for (var i = 0; i < Math.ceil(a.length / 2); i++) {
                            if (a[i].toUpperCase() === a[i] && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.upperCaseFirstWordPlusX,
                                params: [i]
                            }, e),
                            a[a.length - 1 - i].toUpperCase() === a[a.length - 1 - i] && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.upperCaseLastWordMinusX,
                                params: [i]
                            }, e),
                            a[i].toLowerCase() === a[i] && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.lowerCaseFirstWordPlusX,
                                params: [i]
                            }, e),
                            a[a.length - 1 - i].toLowerCase() === a[a.length - 1 - i] && this.addToKnowledgeBase({
                                functionName: o().KnowledgeBaseFunctions.lowerCaseLastWordMinusX,
                                params: [i]
                            }, e),
                            t = a[i])
                                for (var s = 0; s < Math.ceil(t.length / 2); s++)
                                    t[s].toUpperCase() === t[s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.upperCaseFirstCharPlusXOfFirstWordPlusY,
                                        params: [s, i]
                                    }, e),
                                    t[t.length - 1 - s].toUpperCase() === t[t.length - 1 - s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.upperCaseLastCharMinusXOfFirstWordPlusY,
                                        params: [s, i]
                                    }, e),
                                    t[s].toLowerCase() === t[s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXOfFirstWordPlusY,
                                        params: [s, i]
                                    }, e),
                                    t[t.length - 1 - s].toLowerCase() === t[t.length - 1 - s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseLastCharMinusXOfFirstWordPlusY,
                                        params: [s, i]
                                    }, e);
                            if (r = a[a.length - 1 - i])
                                for (var s = 0; s < Math.ceil(r.length / 2); s++)
                                    r[s].toUpperCase() === r[s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.upperCaseFirstCharPlusXOfLastWordMinusY,
                                        params: [s, i]
                                    }, e),
                                    r[r.length - 1 - s].toUpperCase() === r[r.length - 1 - s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.upperCaseLastCharMinusXOfLastWordMinusY,
                                        params: [s, i]
                                    }, e),
                                    r[s].toLowerCase() === r[s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXOfLastWordMinusY,
                                        params: [s, i]
                                    }, e),
                                    r[r.length - 1 - s].toLowerCase() === r[r.length - 1 - s] && this.addToKnowledgeBase({
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseLastCharMinusXOfLastWordMinusY,
                                        params: [s, i]
                                    }, e)
                        }
                        for (var l = "", u = 0, c = void 0, i = 0; i < a.length; i++) {
                            if (0 !== i) {
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.upperCaseBefore,
                                    params: [a[i]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                    params: [a[i]]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: [" ".concat(a[i])]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.lowerCaseBefore,
                                    params: [a[i]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                    params: [a[i]]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: [" ".concat(a[i])]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                    params: [a[i]]
                                }], this.currentOutput),
                                u = (0,
                                n().getLengthOfLongestWord)(l);
                                for (var f = 0; f < Math.ceil(u / 2); f++)
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseFirstCharPlusXBefore,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                        params: [a[i]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[i])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseLastCharMinusXBefore,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                        params: [a[i]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[i])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXBefore,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                        params: [a[i]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[i])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseLastCharMinusXBefore,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBefore,
                                        params: [a[i]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[i])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e)
                            }
                            if (i !== a.length - 1) {
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.upperCaseAfter,
                                    params: [a[i]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: ["".concat(a[i], " ")]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                    params: [a[i]]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.lowerCaseAfter,
                                    params: [a[i]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: ["".concat(a[i], " ")]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                    params: [a[i]]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                    params: [a[i]]
                                }], this.currentOutput),
                                u = (0,
                                n().getLengthOfLongestWord)(l);
                                for (var f = 0; f < Math.ceil(u / 2); f++)
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseFirstCharPlusXAfter,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                        params: [a[i]]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseLastCharMinusXAfter,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                        params: [a[i]]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXAfter,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                        params: [a[i]]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseLastCharMinusXAfter,
                                        params: [a[i], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsAfter,
                                        params: [a[i]]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e)
                            }
                            for (var s = i + 2; s < a.length; s++) {
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.upperCaseBetween,
                                    params: [a[i], a[s]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: ["".concat(a[i], " ")]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                    params: [a[i], a[s]]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: [" ".concat(a[s])]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                c = {
                                    functionName: o().KnowledgeBaseFunctions.lowerCaseBetween,
                                    params: [a[i], a[s]]
                                },
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: ["".concat(a[i], " ")]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                    params: [a[i], a[s]]
                                }, {
                                    functionName: o().KnowledgeBaseFunctions.write,
                                    params: [" ".concat(a[s])]
                                }, c], this.currentOutput),
                                this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                l = this.ki.execute([{
                                    functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                    params: [a[i], a[s]]
                                }], this.currentOutput),
                                u = (0,
                                n().getLengthOfLongestWord)(l);
                                for (var f = 0; f < Math.ceil(u / 2); f++)
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseFirstCharPlusXBetween,
                                        params: [a[i], a[s], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                        params: [a[i], a[s]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[s])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.upperCaseLastCharMinusXBetween,
                                        params: [a[i], a[s], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                        params: [a[i], a[s]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[s])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXBetween,
                                        params: [a[i], a[s], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                        params: [a[i], a[s]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[s])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e),
                                    c = {
                                        functionName: o().KnowledgeBaseFunctions.lowerCaseLastCharMinusXBetween,
                                        params: [a[i], a[s], f]
                                    },
                                    l = this.ki.execute([{
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: ["".concat(a[i], " ")]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.writeWordsBetween,
                                        params: [a[i], a[s]]
                                    }, {
                                        functionName: o().KnowledgeBaseFunctions.write,
                                        params: [" ".concat(a[s])]
                                    }, c], this.currentOutput),
                                    this.currentOutput.indexOf(l) > -1 && this.addToKnowledgeBase(c, e)
                            }
                        }
                    }
                }
                ,
                e
            }()
        },
        343: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(344);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(128);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(71);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s() {
                let e = t(210);
                return s = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.FunctionComposer = void 0;
            var p = new (o()).KnowledgeBaseInterpreter;
            function l(e, a) {
                return (0,
                s().fuzzyMatchForWrite)(a.replace(/\s/, " "), e.replace(/\s/, " "))
            }
            function u(e, a) {
                return (0,
                s().fuzzyMatchForUpperLowerCase)(a.replace(/\s/, " "), e.replace(/\s/, " "))
            }
            a.FunctionComposer = function() {
                function e(e, a) {
                    this.backgroundKnowledge = e,
                    this.examples = a
                }
                return e.prototype.findFunctionComposition = function() {
                    this.calls = 0;
                    var e, a, t, i, o, c = 0;
                    try {
                        for (var f = (0,
                        r().__values)(this.examples), b = f.next(); !b.done; b = f.next()) {
                            var m = b.value;
                            c += l(m.input, m.output)
                        }
                    } catch (a) {
                        e = {
                            error: a
                        }
                    } finally {
                        try {
                            b && !b.done && (a = f.return) && a.call(f)
                        } finally {
                            if (e)
                                throw e.error
                        }
                    }
                    if (!(o = c >= this.examples.length * s().MAX_GAIN ? [{
                        functionName: n().KnowledgeBaseFunctions.writeWholeInput,
                        params: []
                    }] : this._findFunctionComposition("writeFunctions", l, {
                        composition: [],
                        score: c
                    })))
                        return console.error("could not find a functionality that covers all outputs"),
                        [];
                    c = 0;
                    try {
                        for (var g = (0,
                        r().__values)(this.examples), d = g.next(); !d.done; d = g.next()) {
                            var m = d.value;
                            c += u(p.execute(o, m.input), m.output)
                        }
                    } catch (e) {
                        t = {
                            error: e
                        }
                    } finally {
                        try {
                            d && !d.done && (i = g.return) && i.call(g)
                        } finally {
                            if (t)
                                throw t.error
                        }
                    }
                    return c >= this.examples.length * s().MAX_GAIN ? o : this._findFunctionComposition("upperLowerCaseFunctions", u, {
                        composition: o,
                        score: c
                    }) || (console.error("could not find a functionality that covers all outputs"),
                    [])
                }
                ,
                e.prototype._findFunctionComposition = function(e, a, t) {
                    var o, n, l, u, c, f;
                    if (t.composition.length < 50 && this.calls < 1e6) {
                        var b = t.score
                          , m = new (i()).CompositionScoreArray
                          , g = void 0
                          , d = void 0;
                        try {
                            for (var v = (0,
                            r().__values)(this.backgroundKnowledge[e]), k = v.next(); !k.done; k = v.next()) {
                                var y = k.value;
                                d = (0,
                                r().__spreadArray)((0,
                                r().__spreadArray)([], (0,
                                r().__read)(t.composition), !1), [y], !1),
                                g = 0;
                                try {
                                    for (var h = (l = void 0,
                                    (0,
                                    r().__values)(this.examples)), C = h.next(); !C.done; C = h.next()) {
                                        var S = C.value;
                                        if ("writeFunctions" === e && "" === p.execute([y], S.input))
                                            break;
                                        g += a(p.execute(d, S.input), S.output),
                                        this.calls++
                                    }
                                } catch (e) {
                                    l = {
                                        error: e
                                    }
                                } finally {
                                    try {
                                        C && !C.done && (u = h.return) && u.call(h)
                                    } finally {
                                        if (l)
                                            throw l.error
                                    }
                                }
                                if (g >= this.examples.length * s().MAX_GAIN)
                                    return d;
                                g > b && g > 0 && m.add(d, g)
                            }
                        } catch (e) {
                            o = {
                                error: e
                            }
                        } finally {
                            try {
                                k && !k.done && (n = v.return) && n.call(v)
                            } finally {
                                if (o)
                                    throw o.error
                            }
                        }
                        var w = m.getSortedCompositions();
                        try {
                            for (var F = (0,
                            r().__values)(w), B = F.next(); !B.done; B = F.next()) {
                                var P = B.value
                                  , M = this._findFunctionComposition(e, a, P);
                                if (M)
                                    return M
                            }
                        } catch (e) {
                            c = {
                                error: e
                            }
                        } finally {
                            try {
                                B && !B.done && (f = F.return) && f.call(F)
                            } finally {
                                if (c)
                                    throw c.error
                            }
                        }
                    }
                }
                ,
                e
            }()
        },
        128: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(71);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o(e) {
                return void 0 !== e && !isNaN(e)
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.KnowledgeBaseInterpreter = void 0,
            a.KnowledgeBaseInterpreter = function() {
                function e() {
                    var e, a = this;
                    this.input = "",
                    this.finalResult = "",
                    this.kb = ((e = {})[i().KnowledgeBaseFunctions.writeWholeInput] = function() {
                        a.finalResult = a.finalResult.concat(a.input)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeFirstPlusXWord] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.split(i().splitter)
                          , n = a.finalResult.concat(r[t] || "");
                        n && (a.finalResult = n)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeLastMinusXWord] = function(e) {
                        var t = e[0] && parseInt(e[0], 10);
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.split(i().splitter)
                          , n = a.finalResult.concat(r[r.length - 1 - t] || "");
                        n && (a.finalResult = n)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeFirstSpecialCharPlusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.finalResult.concat(a.input.replace(/\s/g, "").split(/[A-Za-z0-9_]/g).join("").split("")[t] || "");
                        r && (a.finalResult = r)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeLastSpecialCharMinusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.replace(/\s/g, "").split(/[A-Za-z0-9_]/g).join("").split("")
                          , i = a.finalResult.concat(r[r.length - 1 - t] || "");
                        i && (a.finalResult = i)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeFirstCharPlusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var n = a.input.split(i().splitter)[r];
                        if (n) {
                            var s = n[t]
                              , p = a.finalResult.concat(s || "");
                            p && (a.finalResult = p)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeLastCharMinusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var n = a.input.split(i().splitter)[r];
                        if (n) {
                            var s = n[n.length - 1 - t]
                              , p = a.finalResult.concat(s || "");
                            p && (a.finalResult = p)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeFirstCharPlusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var n = a.input.split(i().splitter)
                          , s = n[n.length - 1 - r];
                        if (s) {
                            var p = s[t]
                              , l = a.finalResult.concat(p || "");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeLastCharMinusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var n = a.input.split(i().splitter)
                          , s = n[n.length - 1 - r];
                        if (s) {
                            var p = s[s.length - 1 - t]
                              , l = a.finalResult.concat(p || "");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.write] = function(e) {
                        var t = e[0];
                        if ("string" != typeof t) {
                            a.errorLog();
                            return
                        }
                        var r = a.finalResult.concat(t);
                        r && (a.finalResult = r)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeChar] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.finalResult.concat(String.fromCharCode(t));
                        r && (a.finalResult = r)
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeBefore] = function(e) {
                        var t = e[0];
                        if ("string" != typeof t) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.search(new RegExp("\\b".concat(t, "\\b")));
                        if (r > 0) {
                            var i = a.finalResult.concat(a.input.substring(0, r));
                            i && (a.finalResult = i),
                            " " === a.finalResult[a.finalResult.length - 1] && (a.finalResult = a.finalResult.substring(0, a.finalResult.length - 1))
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeAfter] = function(e) {
                        var t = e[0];
                        if ("string" != typeof t) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.search(new RegExp("\\b".concat(t, "\\b")));
                        if (r > -1 && r < a.input.length - 1) {
                            var i = a.finalResult.concat(a.input.substring(r + t.length, a.input.length));
                            i && (a.finalResult = i),
                            " " === a.finalResult[0] && (a.finalResult = a.finalResult.substring(1, a.finalResult.length))
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeBetween] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!("string" == typeof t && "string" == typeof r)) {
                            a.errorLog();
                            return
                        }
                        var i = a.input.search(new RegExp("\\b".concat(t, "\\b")))
                          , o = a.input.search(new RegExp("\\b".concat(r, "\\b")));
                        if (i > -1 && o > -1 && i < o) {
                            var n = a.finalResult.concat(a.input.substring(i + t.length, o));
                            n && (a.finalResult = n),
                            " " === a.finalResult[0] && (a.finalResult = a.finalResult.substring(1, a.finalResult.length)),
                            " " === a.finalResult[a.finalResult.length - 1] && (a.finalResult = a.finalResult.substring(0, a.finalResult.length - 1))
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeWordsBefore] = function(e) {
                        var t = e[0];
                        if ("string" != typeof t) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.split(i().splitter)
                          , o = r.indexOf(t);
                        if (o > 0) {
                            var n = r.slice("" === r[0] ? 1 : 0, o)
                              , s = a.finalResult.concat(n.join(" "));
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeWordsAfter] = function(e) {
                        var t = e[0];
                        if ("string" != typeof t) {
                            a.errorLog();
                            return
                        }
                        var r = a.input.split(i().splitter)
                          , o = r.indexOf(t);
                        if (o > -1 && o < a.input.length - 1) {
                            var n = r.slice(o + 1, "" === r[r.length - 1] ? r.length - 1 : r.length)
                              , s = a.finalResult.concat(n.join(" "));
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.writeWordsBetween] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!("string" == typeof t && "string" == typeof r)) {
                            a.errorLog();
                            return
                        }
                        var o = a.input.split(i().splitter)
                          , n = o.indexOf(t)
                          , s = o.indexOf(r);
                        if (n > -1 && s > -1 && n < s) {
                            var p = o.slice(n + 1, s)
                              , l = a.finalResult.concat(p.join(" "));
                            l && (a.finalResult = l),
                            a.finalResult = a.finalResult.substring(0, a.finalResult.length)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseAll] = function() {
                        a.finalResult = a.finalResult.toUpperCase()
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseAll] = function() {
                        a.finalResult = a.finalResult.toLowerCase()
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstWordPlusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.findWord(t);
                        if (r) {
                            var i = r[0]
                              , n = a.finalResult.split("");
                            n.splice(r.index, i.length, i.toUpperCase());
                            var s = n.join("");
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastWordMinusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.findWord(t, !1);
                        if (r) {
                            var i = r[0]
                              , n = a.finalResult.split("");
                            n.splice(r.index, i.length, i.toUpperCase());
                            var s = n.join("");
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstWordPlusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.findWord(t);
                        if (r) {
                            var i = r[0]
                              , n = a.finalResult.split("");
                            n.splice(r.index, i.length, i.toLowerCase());
                            var s = n.join("");
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastWordMinusX] = function(e) {
                        var t = e[0];
                        if (!o(t)) {
                            a.errorLog();
                            return
                        }
                        var r = a.findWord(t, !1);
                        if (r) {
                            var i = r[0]
                              , n = a.finalResult.split("");
                            n.splice(r.index, i.length, i.toLowerCase());
                            var s = n.join("");
                            s && (a.finalResult = s)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstCharPlusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[t])
                                return;
                            n[t] = n[t].toUpperCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastCharMinusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[n.length - 1 - t])
                                return;
                            n[n.length - 1 - t] = n[n.length - 1 - t].toUpperCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[t])
                                return;
                            n[t] = n[t].toLowerCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastCharMinusXOfFirstWordPlusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[n.length - 1 - t])
                                return;
                            n[n.length - 1 - t] = n[n.length - 1 - t].toLowerCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstCharPlusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r, !1);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[t])
                                return;
                            n[t] = n[t].toUpperCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastCharMinusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r, !1);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[n.length - 1 - t])
                                return;
                            n[n.length - 1 - t] = n[n.length - 1 - t].toUpperCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r, !1);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[t])
                                return;
                            n[t] = n[t].toLowerCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastCharMinusXOfLastWordMinusY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!(o(t) && o(r))) {
                            a.errorLog();
                            return
                        }
                        var i = a.findWord(r, !1);
                        if (i) {
                            var n = i[0].split("");
                            if (!n[n.length - 1 - t])
                                return;
                            n[n.length - 1 - t] = n[n.length - 1 - t].toLowerCase();
                            var s = n.join("")
                              , p = a.finalResult.split("");
                            p.splice(i.index, s.length, s);
                            var l = p.join("");
                            l && (a.finalResult = l)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseBefore] = function(e) {
                        var t, r = e[0];
                        if ("string" != typeof r) {
                            a.errorLog();
                            return
                        }
                        for (var i = 0, o = ""; (t = a.findWord(i)) && (o = t[0]) !== r; ) {
                            var n = a.finalResult.split("");
                            n.splice(t.index, o.length, o.toUpperCase());
                            var s = n.join("");
                            s && (a.finalResult = s),
                            i++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseAfter] = function(e) {
                        var t, r = e[0];
                        if ("string" != typeof r) {
                            a.errorLog();
                            return
                        }
                        for (var i = 0, o = "", n = !1; t = a.findWord(i); ) {
                            if (o = t[0],
                            n) {
                                var s = a.finalResult.split("");
                                s.splice(t.index, o.length, o.toUpperCase());
                                var p = s.join("");
                                p && (a.finalResult = p)
                            }
                            o === r && (n = !0),
                            i++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseBefore] = function(e) {
                        var t, r = e[0];
                        if ("string" != typeof r) {
                            a.errorLog();
                            return
                        }
                        for (var i = 0, o = ""; (t = a.findWord(i)) && (o = t[0]) !== r; ) {
                            var n = a.finalResult.split("");
                            n.splice(t.index, o.length, o.toLowerCase());
                            var s = n.join("");
                            s && (a.finalResult = s),
                            i++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseAfter] = function(e) {
                        var t, r = e[0];
                        if ("string" != typeof r) {
                            a.errorLog();
                            return
                        }
                        for (var i = 0, o = "", n = !1; t = a.findWord(i); ) {
                            if (o = t[0],
                            n) {
                                var s = a.finalResult.split("");
                                s.splice(t.index, o.length, o.toLowerCase());
                                var p = s.join("");
                                p && (a.finalResult = p)
                            }
                            o === r && (n = !0),
                            i++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseBetween] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && "string" == typeof i)) {
                            a.errorLog();
                            return
                        }
                        for (var o = 0, n = !1, s = ""; (t = a.findWord(o)) && (s = t[0]) !== i; ) {
                            if (n) {
                                var p = a.finalResult.split("");
                                p.splice(t.index, s.length, s.toUpperCase());
                                var l = p.join("");
                                l && (a.finalResult = l)
                            }
                            s === r && (n = !0),
                            o++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseBetween] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && "string" == typeof i)) {
                            a.errorLog();
                            return
                        }
                        for (var o = 0, n = !1, s = ""; (t = a.findWord(o)) && (s = t[0]) !== i; ) {
                            if (n) {
                                var p = a.finalResult.split("");
                                p.splice(t.index, s.length, s.toLowerCase());
                                var l = p.join("");
                                l && (a.finalResult = l)
                            }
                            s === r && (n = !0),
                            o++
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstCharPlusXBefore] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = ""; (t = a.findWord(n)) && (n++,
                        (s = t[0]) !== r); ) {
                            var p = s.split("");
                            if (p[i]) {
                                p[i] = p[i].toUpperCase();
                                var l = p.join("")
                                  , u = a.finalResult.split("");
                                u.splice(t.index, s.length, l);
                                var c = u.join("");
                                c && (a.finalResult = c)
                            }
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastCharMinusXBefore] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = ""; (t = a.findWord(n)) && (n++,
                        (s = t[0]) !== r); ) {
                            var p = s.split("");
                            if (p[p.length - 1 - i]) {
                                p[p.length - 1 - i] = p[p.length - 1 - i].toUpperCase();
                                var l = p.join("")
                                  , u = a.finalResult.split("");
                                u.splice(t.index, s.length, l);
                                var c = u.join("");
                                c && (a.finalResult = c)
                            }
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXBefore] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = ""; (t = a.findWord(n)) && (n++,
                        (s = t[0]) !== r); ) {
                            var p = s.split("");
                            if (p[i]) {
                                p[i] = p[i].toLowerCase();
                                var l = p.join("")
                                  , u = a.finalResult.split("");
                                u.splice(t.index, s.length, l);
                                var c = u.join("");
                                c && (a.finalResult = c)
                            }
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastCharMinusXBefore] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = ""; (t = a.findWord(n)) && (n++,
                        (s = t[0]) !== r); ) {
                            var p = s.split("");
                            if (p[p.length - 1 - i]) {
                                p[p.length - 1 - i] = p[p.length - 1 - i].toLowerCase();
                                var l = p.join("")
                                  , u = a.finalResult.split("");
                                u.splice(t.index, s.length, l);
                                var c = u.join("");
                                c && (a.finalResult = c)
                            }
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstCharPlusXAfter] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = "", p = !1; t = a.findWord(n); ) {
                            if (n++,
                            s = t[0],
                            p) {
                                var l = s.split("");
                                if (!l[i])
                                    continue;
                                l[i] = l[i].toUpperCase();
                                var u = l.join("")
                                  , c = a.finalResult.split("");
                                c.splice(t.index, s.length, u);
                                var f = c.join("");
                                f && (a.finalResult = f)
                            }
                            s === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastCharMinusXAfter] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = "", p = !1; t = a.findWord(n); ) {
                            if (n++,
                            s = t[0],
                            p) {
                                var l = s.split("");
                                if (!l[l.length - 1 - i])
                                    continue;
                                l[l.length - 1 - i] = l[l.length - 1 - i].toUpperCase();
                                var u = l.join("")
                                  , c = a.finalResult.split("");
                                c.splice(t.index, s.length, u);
                                var f = c.join("");
                                f && (a.finalResult = f)
                            }
                            s === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXAfter] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = "", p = !1; t = a.findWord(n); ) {
                            if (n++,
                            s = t[0],
                            p) {
                                var l = s.split("");
                                if (!l[i])
                                    continue;
                                l[i] = l[i].toLowerCase();
                                var u = l.join("")
                                  , c = a.finalResult.split("");
                                c.splice(t.index, s.length, u);
                                var f = c.join("");
                                f && (a.finalResult = f)
                            }
                            s === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastCharMinusXAfter] = function(e) {
                        var t, r = e[0], i = e[1];
                        if (!("string" == typeof r && o(i))) {
                            a.errorLog();
                            return
                        }
                        for (var n = 0, s = "", p = !1; t = a.findWord(n); ) {
                            if (n++,
                            s = t[0],
                            p) {
                                var l = s.split("");
                                if (!l[l.length - 1 - i])
                                    continue;
                                l[l.length - 1 - i] = l[l.length - 1 - i].toLowerCase();
                                var u = l.join("")
                                  , c = a.finalResult.split("");
                                c.splice(t.index, s.length, u);
                                var f = c.join("");
                                f && (a.finalResult = f)
                            }
                            s === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseFirstCharPlusXBetween] = function(e) {
                        var t, r = e[0], i = e[1], n = e[2];
                        if (!("string" == typeof r && "string" == typeof i && o(n))) {
                            a.errorLog();
                            return
                        }
                        for (var s = 0, p = !1, l = ""; (t = a.findWord(s)) && (s++,
                        (l = t[0]) !== i); ) {
                            if (p) {
                                var u = l.split("");
                                if (!u[n])
                                    continue;
                                u[n] = u[n].toUpperCase();
                                var c = u.join("")
                                  , f = a.finalResult.split("");
                                f.splice(t.index, l.length, c);
                                var b = f.join("");
                                b && (a.finalResult = b)
                            }
                            l === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.upperCaseLastCharMinusXBetween] = function(e) {
                        var t, r = e[0], i = e[1], n = e[2];
                        if (!("string" == typeof r && "string" == typeof i && o(n))) {
                            a.errorLog();
                            return
                        }
                        for (var s = 0, p = !1, l = ""; (t = a.findWord(s)) && (s++,
                        (l = t[0]) !== i); ) {
                            if (p) {
                                var u = l.split("");
                                if (!u[u.length - 1 - n])
                                    continue;
                                u[u.length - 1 - n] = u[u.length - 1 - n].toUpperCase();
                                var c = u.join("")
                                  , f = a.finalResult.split("");
                                f.splice(t.index, l.length, c);
                                var b = f.join("");
                                b && (a.finalResult = b)
                            }
                            l === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseFirstCharPlusXBetween] = function(e) {
                        var t, r = e[0], i = e[1], n = e[2];
                        if (!("string" == typeof r && "string" == typeof i && o(n))) {
                            a.errorLog();
                            return
                        }
                        for (var s = 0, p = !1, l = ""; (t = a.findWord(s)) && (s++,
                        (l = t[0]) !== i); ) {
                            if (p) {
                                var u = l.split("");
                                if (!u[n])
                                    continue;
                                u[n] = u[n].toLowerCase();
                                var c = u.join("")
                                  , f = a.finalResult.split("");
                                f.splice(t.index, l.length, c);
                                var b = f.join("");
                                b && (a.finalResult = b)
                            }
                            l === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.lowerCaseLastCharMinusXBetween] = function(e) {
                        var t, r = e[0], i = e[1], n = e[2];
                        if (!("string" == typeof r && "string" == typeof i && o(n))) {
                            a.errorLog();
                            return
                        }
                        for (var s = 0, p = !1, l = ""; (t = a.findWord(s)) && (s++,
                        (l = t[0]) !== i); ) {
                            if (p) {
                                var u = l.split("");
                                if (!u[u.length - 1 - n])
                                    continue;
                                u[u.length - 1 - n] = u[u.length - 1 - n].toLowerCase();
                                var c = u.join("")
                                  , f = a.finalResult.split("");
                                f.splice(t.index, l.length, c);
                                var b = f.join("");
                                b && (a.finalResult = b)
                            }
                            l === r && (p = !0)
                        }
                    }
                    ,
                    e[i().KnowledgeBaseFunctions.replaceAllXWithY] = function(e) {
                        var t = e[0]
                          , r = e[1];
                        if (!("string" == typeof t && "string" == typeof r)) {
                            a.errorLog();
                            return
                        }
                        a.finalResult = "" === a.finalResult ? a.input.replace(RegExp(t, "g"), r) : a.finalResult.replace(RegExp(t, "g"), r)
                    }
                    ,
                    e)
                }
                return e.prototype.execute = function(e, a) {
                    this.input = a;
                    try {
                        for (var t, i, o = (0,
                        r().__values)(e), n = o.next(); !n.done; n = o.next()) {
                            var s = n.value
                              , p = this.kb[s.functionName];
                            if (!p)
                                return console.error("function does not exist!"),
                                "";
                            p(s.params)
                        }
                    } catch (e) {
                        t = {
                            error: e
                        }
                    } finally {
                        try {
                            n && !n.done && (i = o.return) && i.call(o)
                        } finally {
                            if (t)
                                throw t.error
                        }
                    }
                    this.input = "";
                    var l = this.finalResult;
                    return this.finalResult = "",
                    l
                }
                ,
                e.prototype.errorLog = function() {
                    console.error("not correct parameters provided")
                }
                ,
                e.prototype.findWord = function(e, a) {
                    void 0 === a && (a = !0);
                    for (var t = /[A-Za-z0-9_]+/g, r = [], i = null; i = t.exec(this.finalResult); )
                        r.push(i);
                    return a ? r[e] : r[r.length - 1 - e]
                }
                ,
                e
            }()
        },
        1020: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.patternBasedFunctionClientSingleton = void 0;
            var i = new (function() {
                function e() {
                    var e = "/sap/fpa/ui/workerProxy/workerProxy.js?".concat(t.workerChunkUrl("patternBasedFunctionWorker"));
                    this.worker = new Worker(e)
                }
                return e.prototype.findFunctionComposition = function(e, a, i) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var o, n = this;
                        return (0,
                        r().__generator)(this, function(r) {
                            return o = 0,
                            [2, new Promise(function(r, s) {
                                n.worker.postMessage({
                                    method: "findFunctionComposition",
                                    backgroundKnowledge: e,
                                    examples: a
                                });
                                var p = function(e) {
                                    clearInterval(l),
                                    n.worker.removeEventListener("message", p),
                                    r(e.data)
                                };
                                n.worker.addEventListener("message", p);
                                var l = setInterval(function() {
                                    if (100 * o > (i || 15e3)) {
                                        clearInterval(l),
                                        n.worker.terminate();
                                        var e = "/sap/fpa/ui/workerProxy/workerProxy.js?".concat(t.workerChunkUrl("patternBasedFunctionWorker"));
                                        n.worker = new Worker(e),
                                        r([])
                                    }
                                    o++
                                }, 100)
                            }
                            )]
                        })
                    })
                }
                ,
                e.prototype.executeFunctionComposition = function(e, a) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var t = this;
                        return (0,
                        r().__generator)(this, function(r) {
                            return [2, new Promise(function(r, i) {
                                t.worker.postMessage({
                                    method: "executeFunctionComposition",
                                    functionComposition: e,
                                    input: a
                                });
                                var o = function(e) {
                                    t.worker.removeEventListener("message", o),
                                    r(e.data)
                                };
                                t.worker.addEventListener("message", o)
                            }
                            )]
                        })
                    })
                }
                ,
                e
            }());
            a.patternBasedFunctionClientSingleton = i
        },
        210: function(e, a, t) {
            function r() {
                let e = t(71);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.MAX_GAIN = void 0,
            a.fuzzyMatchForUpperLowerCase = function(e, a) {
                if (e.length !== a.length)
                    return console.error("texts not haveing the same length after write functions"),
                    -1;
                if (e === a)
                    return i;
                for (var t = 0, r = 0; r < e.length; r++)
                    e[r] === a[r] && t++;
                return t
            }
            ,
            a.fuzzyMatchForWrite = function(e, a) {
                if (e.substring(0, a.length).toLowerCase() !== a.toLowerCase())
                    return -100;
                var t = Math.abs(e.length - a.length);
                return t > 0 ? e.length / t : i
            }
            ,
            a.getLengthOfLongestWord = function(e) {
                var a = e.split(r().splitter);
                return a.length > 0 ? a.slice().sort(function(e, a) {
                    return a.length - e.length
                })[0].length : 0
            }
            ;
            var i = a.MAX_GAIN = 5e3
        },
        1018: function(e, a, t) {
            function r() {
                let e = t(1019);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(343);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(128);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(1020);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s() {
                let e = t(71);
                return s = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            Object.defineProperty(a, "BackgroundKnowledge", {
                enumerable: !0,
                get: function() {
                    return s().BackgroundKnowledge
                }
            }),
            Object.defineProperty(a, "DynamicKnowledgeBase", {
                enumerable: !0,
                get: function() {
                    return r().DynamicKnowledgeBase
                }
            }),
            Object.defineProperty(a, "FunctionComposer", {
                enumerable: !0,
                get: function() {
                    return i().FunctionComposer
                }
            }),
            Object.defineProperty(a, "FunctionComposition", {
                enumerable: !0,
                get: function() {
                    return s().FunctionComposition
                }
            }),
            Object.defineProperty(a, "IOExample", {
                enumerable: !0,
                get: function() {
                    return s().IOExample
                }
            }),
            Object.defineProperty(a, "KnowledgeBaseFunctions", {
                enumerable: !0,
                get: function() {
                    return s().KnowledgeBaseFunctions
                }
            }),
            Object.defineProperty(a, "KnowledgeBaseInterpreter", {
                enumerable: !0,
                get: function() {
                    return o().KnowledgeBaseInterpreter
                }
            }),
            Object.defineProperty(a, "patternBasedFunctionClientSingleton", {
                enumerable: !0,
                get: function() {
                    return n().patternBasedFunctionClientSingleton
                }
            })
        },
        71: function(e, a) {
            var t, r;
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.splitter = a.seperator = a.KnowledgeBaseFunctions = void 0,
            (r = t || (a.KnowledgeBaseFunctions = t = {}))[r.writeWholeInput = 0] = "writeWholeInput",
            r[r.writeFirstPlusXWord = 1] = "writeFirstPlusXWord",
            r[r.writeLastMinusXWord = 2] = "writeLastMinusXWord",
            r[r.writeFirstCharPlusXOfFirstWordPlusY = 3] = "writeFirstCharPlusXOfFirstWordPlusY",
            r[r.writeLastCharMinusXOfFirstWordPlusY = 4] = "writeLastCharMinusXOfFirstWordPlusY",
            r[r.writeFirstCharPlusXOfLastWordMinusY = 5] = "writeFirstCharPlusXOfLastWordMinusY",
            r[r.writeLastCharMinusXOfLastWordMinusY = 6] = "writeLastCharMinusXOfLastWordMinusY",
            r[r.writeFirstSpecialCharPlusX = 7] = "writeFirstSpecialCharPlusX",
            r[r.writeLastSpecialCharMinusX = 8] = "writeLastSpecialCharMinusX",
            r[r.write = 9] = "write",
            r[r.writeChar = 10] = "writeChar",
            r[r.writeBefore = 11] = "writeBefore",
            r[r.writeAfter = 12] = "writeAfter",
            r[r.writeBetween = 13] = "writeBetween",
            r[r.writeWordsBefore = 14] = "writeWordsBefore",
            r[r.writeWordsAfter = 15] = "writeWordsAfter",
            r[r.writeWordsBetween = 16] = "writeWordsBetween",
            r[r.upperCaseAll = 17] = "upperCaseAll",
            r[r.lowerCaseAll = 18] = "lowerCaseAll",
            r[r.upperCaseFirstWordPlusX = 19] = "upperCaseFirstWordPlusX",
            r[r.upperCaseLastWordMinusX = 20] = "upperCaseLastWordMinusX",
            r[r.lowerCaseFirstWordPlusX = 21] = "lowerCaseFirstWordPlusX",
            r[r.lowerCaseLastWordMinusX = 22] = "lowerCaseLastWordMinusX",
            r[r.upperCaseFirstCharPlusXOfFirstWordPlusY = 23] = "upperCaseFirstCharPlusXOfFirstWordPlusY",
            r[r.upperCaseLastCharMinusXOfFirstWordPlusY = 24] = "upperCaseLastCharMinusXOfFirstWordPlusY",
            r[r.lowerCaseFirstCharPlusXOfFirstWordPlusY = 25] = "lowerCaseFirstCharPlusXOfFirstWordPlusY",
            r[r.lowerCaseLastCharMinusXOfFirstWordPlusY = 26] = "lowerCaseLastCharMinusXOfFirstWordPlusY",
            r[r.upperCaseFirstCharPlusXOfLastWordMinusY = 27] = "upperCaseFirstCharPlusXOfLastWordMinusY",
            r[r.upperCaseLastCharMinusXOfLastWordMinusY = 28] = "upperCaseLastCharMinusXOfLastWordMinusY",
            r[r.lowerCaseFirstCharPlusXOfLastWordMinusY = 29] = "lowerCaseFirstCharPlusXOfLastWordMinusY",
            r[r.lowerCaseLastCharMinusXOfLastWordMinusY = 30] = "lowerCaseLastCharMinusXOfLastWordMinusY",
            r[r.upperCaseBefore = 31] = "upperCaseBefore",
            r[r.upperCaseAfter = 32] = "upperCaseAfter",
            r[r.lowerCaseBefore = 33] = "lowerCaseBefore",
            r[r.lowerCaseAfter = 34] = "lowerCaseAfter",
            r[r.upperCaseBetween = 35] = "upperCaseBetween",
            r[r.lowerCaseBetween = 36] = "lowerCaseBetween",
            r[r.upperCaseFirstCharPlusXBefore = 37] = "upperCaseFirstCharPlusXBefore",
            r[r.upperCaseLastCharMinusXBefore = 38] = "upperCaseLastCharMinusXBefore",
            r[r.lowerCaseFirstCharPlusXBefore = 39] = "lowerCaseFirstCharPlusXBefore",
            r[r.lowerCaseLastCharMinusXBefore = 40] = "lowerCaseLastCharMinusXBefore",
            r[r.upperCaseFirstCharPlusXAfter = 41] = "upperCaseFirstCharPlusXAfter",
            r[r.upperCaseLastCharMinusXAfter = 42] = "upperCaseLastCharMinusXAfter",
            r[r.lowerCaseFirstCharPlusXAfter = 43] = "lowerCaseFirstCharPlusXAfter",
            r[r.lowerCaseLastCharMinusXAfter = 44] = "lowerCaseLastCharMinusXAfter",
            r[r.upperCaseFirstCharPlusXBetween = 45] = "upperCaseFirstCharPlusXBetween",
            r[r.upperCaseLastCharMinusXBetween = 46] = "upperCaseLastCharMinusXBetween",
            r[r.lowerCaseFirstCharPlusXBetween = 47] = "lowerCaseFirstCharPlusXBetween",
            r[r.lowerCaseLastCharMinusXBetween = 48] = "lowerCaseLastCharMinusXBetween",
            r[r.replaceAllXWithY = 49] = "replaceAllXWithY",
            a.seperator = "_._",
            a.splitter = /[^A-Za-z0-9_]+/g
        },
        1837: function(e, a, t) {
            var r;
            function i() {
                let e = t(3);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(1838);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n(e, a) {
                if (!o().NativeAsyncFunctionConstructor)
                    throw Error("Native async/await not supported");
                return new (o().NativeAsyncFunctionConstructor.bind.apply(o().NativeAsyncFunctionConstructor, (0,
                i().__spreadArray)((0,
                i().__spreadArray)([void 0], (0,
                i().__read)(a), !1), [e], !1)))
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.load = function(e, a) {
                return (0,
                i().__awaiter)(this, void 0, Promise, function() {
                    return (0,
                    i().__generator)(this, function(s) {
                        switch (s.label) {
                        case 0:
                            if (!(e && o().NativeAsyncFunctionConstructor))
                                return [3, 1];
                            return [2, n];
                        case 1:
                            if (void 0 !== r)
                                return [3, 3];
                            return [4, function(e) {
                                return (0,
                                i().__awaiter)(this, void 0, Promise, function() {
                                    var a;
                                    return (0,
                                    i().__generator)(this, function(r) {
                                        switch (r.label) {
                                        case 0:
                                            return [4, function() {
                                                return (0,
                                                i().__awaiter)(this, void 0, Promise, function() {
                                                    return (0,
                                                    i().__generator)(this, function(e) {
                                                        return [2, new Promise(function(e, a) {
                                                            Promise.all([t.e(17), t.e(18), t.e(675)]).then((function() {
                                                                e(t(2298))
                                                            }
                                                            ).bind(null, t)).catch(function(e) {
                                                                console.error("Failed to load Transpiler", e),
                                                                a("Failed to load Transpiler")
                                                            })
                                                        }
                                                        )]
                                                    })
                                                })
                                            }()];
                                        case 1:
                                            return a = r.sent(),
                                            [2, function(t, r) {
                                                var o = new a().compile("(async function $anonymous() {\n".concat(t, "\n}).bind(this)();"), "theScript", {
                                                    sourcemap: !1,
                                                    promises: !0,
                                                    noRuntime: !0,
                                                    es6target: !1,
                                                    wrapAwait: !0
                                                })
                                                  , n = "return ".concat(o.code);
                                                e && console.debug("SandboxRuntime: transpiled script: ", n);
                                                var s = new (Function.bind.apply(Function, (0,
                                                i().__spreadArray)((0,
                                                i().__spreadArray)([void 0], (0,
                                                i().__read)(r), !1), [n], !1)));
                                                return function() {
                                                    return s.apply(this, arguments)
                                                }
                                            }
                                            ]
                                        }
                                    })
                                })
                            }(a)];
                        case 2:
                            r = s.sent(),
                            s.label = 3;
                        case 3:
                            return [2, r]
                        }
                    })
                })
            }
        },
        1839: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = function(e, a) {
                    if (!a && e && e.__esModule)
                        return e;
                    if (null === e || "object" != typeof e && "function" != typeof e)
                        return {
                            default: e
                        };
                    var t = o(a);
                    if (t && t.has(e))
                        return t.get(e);
                    var r = {
                        __proto__: null
                    }
                      , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                    for (var n in e)
                        if ("default" !== n && ({}).hasOwnProperty.call(e, n)) {
                            var s = i ? Object.getOwnPropertyDescriptor(e, n) : null;
                            s && (s.get || s.set) ? Object.defineProperty(r, n, s) : r[n] = e[n]
                        }
                    return r.default = e,
                    t && t.set(e, r),
                    r
                }(t(85));
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (o = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.wrapConsoleLog = function() {
                if (!self.navigator.userAgent.includes("Trident/")) {
                    var e = self.console.log.bind(this);
                    self.console.log = function() {
                        for (var a = [], t = 0; t < arguments.length; t++)
                            a[t] = arguments[t];
                        a.forEach(function(e, t) {
                            e && e[i().HIDDEN_SCOPE_PATH] && (a[t] = e[i().HIDDEN_SCOPE_PATH])
                        }),
                        e.apply(void 0, (0,
                        r().__spreadArray)([], (0,
                        r().__read)(a), !1))
                    }
                }
            }
        },
        1838: function(e, a) {
            var t;
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.NativeAsyncFunctionConstructor = void 0;
            try {
                t = eval.call(void 0, "(async function(){}).constructor")
            } catch (e) {
                t = void 0
            }
            a.NativeAsyncFunctionConstructor = t
        },
        651: function(e, a, t) {
            function r() {
                let e = t(1841);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = function(e, a) {
                    if (!a && e && e.__esModule)
                        return e;
                    if (null === e || "object" != typeof e && "function" != typeof e)
                        return {
                            default: e
                        };
                    var t = s(a);
                    if (t && t.has(e))
                        return t.get(e);
                    var r = {
                        __proto__: null
                    }
                      , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                    for (var o in e)
                        if ("default" !== o && ({}).hasOwnProperty.call(e, o)) {
                            var n = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                            n && (n.get || n.set) ? Object.defineProperty(r, o, n) : r[o] = e[o]
                        }
                    return r.default = e,
                    t && t.set(e, r),
                    r
                }(t(61));
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(114);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(72);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (s = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.AbstractScopeBackend = void 0,
            a.AbstractScopeBackend = function() {
                function e(e, a) {
                    this.defs = e,
                    this.worker = a,
                    this.objects = {},
                    this.initializePrimitives()
                }
                return e.prototype.initializePrimitives = function() {
                    for (var e in this.defs)
                        if (this.defs.hasOwnProperty(e)) {
                            var a = this.defs[e];
                            a && i().isPrimitive(a) && (this.objects[e] = a.value)
                        }
                }
                ,
                e.prototype.get = function(e) {
                    var a = this.objects[e];
                    if (void 0 === a && this.defs.hasOwnProperty(e)) {
                        var t = this.defs[e];
                        if (t && !i().isPrimitive(t)) {
                            var o = (0,
                            n().getTypeDefinition)(this.worker.types, t.type);
                            void 0 !== o ? a = this.objects[e] = (0,
                            n().isGlobal)(o) ? r().globals[e] : this.createProxy(e, o, this.worker) : console.warn('Type not found "'.concat(t.type, '"'))
                        }
                    }
                    return a
                }
                ,
                e.prototype.getForTransport = function(e) {
                    var a, t = this.get(e), r = null === (a = this.defs[e]) || void 0 === a ? void 0 : a.type;
                    return (0,
                    o().marshall)(t, r)
                }
                ,
                e.prototype.set = function(e, a) {
                    (this.objects.hasOwnProperty(e) && a !== this.objects[e] || this.worker.trackedProps.includes(e) && Array.isArray(a)) && (this.objects[e] = a,
                    this.worker.notifyPropChanged(e))
                }
                ,
                e.prototype.updateProp = function(e, a) {
                    if (a) {
                        if (i().isPrimitive(a))
                            t = this.objects[e] = a.value;
                        else if (a.ref && void 0 === (t = this.get(a.ref))) {
                            var t, r = a.ref, o = (0,
                            n().getTypeDefinition)(this.worker.types, a.type);
                            void 0 !== o && (t = this.objects[e] = this.createProxy(r, o, this.worker))
                        }
                        return t
                    }
                }
                ,
                e.prototype.ownKeys = function() {
                    return Object.getOwnPropertyNames(this.defs)
                }
                ,
                e
            }()
        },
        417: function(e, a, t) {
            function r() {
                let e = function(e, a) {
                    if (!a && e && e.__esModule)
                        return e;
                    if (null === e || "object" != typeof e && "function" != typeof e)
                        return {
                            default: e
                        };
                    var t = i(a);
                    if (t && t.has(e))
                        return t.get(e);
                    var r = {
                        __proto__: null
                    }
                      , o = Object.defineProperty && Object.getOwnPropertyDescriptor;
                    for (var n in e)
                        if ("default" !== n && ({}).hasOwnProperty.call(e, n)) {
                            var s = o ? Object.getOwnPropertyDescriptor(e, n) : null;
                            s && (s.get || s.set) ? Object.defineProperty(r, n, s) : r[n] = e[n]
                        }
                    return r.default = e,
                    t && t.set(e, r),
                    r
                }(t(85));
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (i = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.__cast = function(e, a) {
                var t = a && a["!tmp-proto-chain"];
                if (t && !t.includes(e))
                    throw Error("Cannot cast ".concat(t[0], " to ").concat(e))
            }
            ,
            a.cast = function(e, a) {
                if (a && "function" == typeof a[r().CAST])
                    try {
                        a.__cast(e)
                    } catch (e) {
                        throw Error(e.message)
                    }
                return a
            }
        },
        1841: function(e, a, t) {
            function r() {
                let e = t(417);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.globals = void 0,
            a.globals = {
                cast: r().cast
            }
        },
        85: function(e, a) {
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.HIDDEN_SCOPE_PATH = a.GLOAL_SCOPE = a.CAST = void 0,
            a.HIDDEN_SCOPE_PATH = "__scopePath",
            a.CAST = "__cast",
            a.GLOAL_SCOPE = "$$"
        },
        1840: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(417);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = f(t(85));
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(650);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s() {
                let e = t(651);
                return s = function() {
                    return e
                }
                ,
                e
            }
            function p() {
                let e = f(t(61));
                return p = function() {
                    return e
                }
                ,
                e
            }
            function l() {
                let e = t(114);
                return l = function() {
                    return e
                }
                ,
                e
            }
            function u() {
                let e = t(72);
                return u = function() {
                    return e
                }
                ,
                e
            }
            function c(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (c = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            function f(e, a) {
                if (!a && e && e.__esModule)
                    return e;
                if (null === e || "object" != typeof e && "function" != typeof e)
                    return {
                        default: e
                    };
                var t = c(a);
                if (t && t.has(e))
                    return t.get(e);
                var r = {
                    __proto__: null
                }
                  , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var o in e)
                    if ("default" !== o && ({}).hasOwnProperty.call(e, o)) {
                        var n = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                        n && (n.get || n.set) ? Object.defineProperty(r, o, n) : r[o] = e[o]
                    }
                return r.default = e,
                t && t.set(e, r),
                r
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.NoProxiesScope = void 0,
            a.NoProxiesScope = function(e) {
                function a(a, t) {
                    var r = e.call(this, t, a) || this;
                    return r.scopeAsProxy = {},
                    r.buildScope(),
                    r
                }
                return (0,
                r().__extends)(a, e),
                a.prototype.buildScope = function() {
                    var e = this;
                    Object.getOwnPropertyNames(this.defs).forEach(function(a) {
                        Object.defineProperty(e.scopeAsProxy, a, {
                            enumerable: !1,
                            configurable: !1,
                            get: function() {
                                return e.get(a)
                            },
                            set: function(t) {
                                return e.set(a, t),
                                !0
                            }
                        })
                    })
                }
                ,
                a.prototype.createProxy = function(e, a) {
                    return function(e, a, t, s) {
                        var c, f, b = this, m = (0,
                        u().isFunctionType)(a) ? (0,
                        n().createProxyFunction)(void 0, e, t) : {};
                        Object.defineProperty(m, o().HIDDEN_SCOPE_PATH, {
                            enumerable: !1,
                            configurable: !1,
                            get: function() {
                                return e
                            }
                        }),
                        Object.defineProperty(m, o().GLOAL_SCOPE, {
                            enumerable: !1,
                            configurable: !1,
                            get: function() {
                                return t.scope.getScopeProxy()
                            }
                        }),
                        Object.defineProperty(m, o().CAST, {
                            enumerable: !1,
                            configurable: !1,
                            get: function() {
                                return function(e) {
                                    return (0,
                                    i().__cast)(e, a)
                                }
                            }
                        });
                        var g = function(i) {
                            if (a.hasOwnProperty(i) && (0,
                            u().isProperty)(i)) {
                                var o = a[i];
                                if (o && (0,
                                u().isFunctionType)(o)) {
                                    var s = (0,
                                    u().asExtendedTypeDef)(o);
                                    m[i] = (0,
                                    n().createProxyOrCustomFunction)(e, i, t, s, m, !1)
                                } else
                                    Object.defineProperty(m, i, {
                                        enumerable: !0,
                                        configurable: !1,
                                        get: function() {
                                            return (0,
                                            r().__awaiter)(b, void 0, void 0, function() {
                                                return (0,
                                                r().__generator)(this, function(a) {
                                                    return [2, t.postAndWait((0,
                                                    l().createGetMessage)(t.createSeqId(), p().createPath(e, i)))]
                                                })
                                            })
                                        },
                                        set: function(a) {
                                            return t.postDontWait((0,
                                            l().createSetMessage)(t.createSeqId(), p().createPath(e, i), a)),
                                            !0
                                        }
                                    })
                            }
                        };
                        for (var d in a)
                            g(d);
                        var v = function(a) {
                            Object.defineProperty(m, a, {
                                enumerable: !0,
                                configurable: !1,
                                get: function() {
                                    return (0,
                                    r().__awaiter)(b, void 0, void 0, function() {
                                        return (0,
                                        r().__generator)(this, function(r) {
                                            return [2, t.postAndWait((0,
                                            l().createGetMessage)(t.createSeqId(), p().createPath(e, a)))]
                                        })
                                    })
                                },
                                set: function(r) {
                                    return t.postDontWait((0,
                                    l().createSetMessage)(t.createSeqId(), p().createPath(e, a), r)),
                                    !0
                                }
                            })
                        };
                        try {
                            for (var k = (0,
                            r().__values)((0,
                            u().getPrivateProperties)(a)), y = k.next(); !y.done; y = k.next()) {
                                var d = y.value;
                                v(d)
                            }
                        } catch (e) {
                            c = {
                                error: e
                            }
                        } finally {
                            try {
                                y && !y.done && (f = k.return) && f.call(k)
                            } finally {
                                if (c)
                                    throw c.error
                            }
                        }
                        return m
                    }(e, a, this.worker)
                }
                ,
                a.prototype.getScopeProxy = function() {
                    return this.scopeAsProxy
                }
                ,
                a
            }(s().AbstractScopeBackend)
        },
        1842: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(417);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = f(t(85));
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(650);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s() {
                let e = t(651);
                return s = function() {
                    return e
                }
                ,
                e
            }
            function p() {
                let e = f(t(61));
                return p = function() {
                    return e
                }
                ,
                e
            }
            function l() {
                let e = t(114);
                return l = function() {
                    return e
                }
                ,
                e
            }
            function u() {
                let e = t(72);
                return u = function() {
                    return e
                }
                ,
                e
            }
            function c(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (c = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            function f(e, a) {
                if (!a && e && e.__esModule)
                    return e;
                if (null === e || "object" != typeof e && "function" != typeof e)
                    return {
                        default: e
                    };
                var t = c(a);
                if (t && t.has(e))
                    return t.get(e);
                var r = {
                    __proto__: null
                }
                  , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var o in e)
                    if ("default" !== o && ({}).hasOwnProperty.call(e, o)) {
                        var n = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                        n && (n.get || n.set) ? Object.defineProperty(r, o, n) : r[o] = e[o]
                    }
                return r.default = e,
                t && t.set(e, r),
                r
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.ProxiesScope = void 0;
            var b = {}
              , m = function() {
                function e() {}
                return e.prototype.has = function(e, a) {
                    return !0
                }
                ,
                e.prototype.get = function(e, a, t) {}
                ,
                e.prototype.set = function(e, a, t) {
                    return !1
                }
                ,
                e.prototype.ownKeys = function(e) {
                    return []
                }
                ,
                e.prototype.getPrototypeOf = function(e) {
                    return null
                }
                ,
                e.prototype.setPrototypeOf = function(e, a) {
                    return !1
                }
                ,
                e.prototype.defineProperty = function(e, a, t) {
                    return !1
                }
                ,
                e.prototype.deleteProperty = function(e, a) {
                    return !1
                }
                ,
                e.prototype.isExtensible = function(e) {
                    return !1
                }
                ,
                e.prototype.preventExtensions = function(e) {
                    return !1
                }
                ,
                e.prototype.apply = function(e, a, t) {}
                ,
                e.prototype.construct = function(e, a, t) {
                    return {}
                }
                ,
                e.prototype.enumerate = function(e) {
                    return []
                }
                ,
                e
            }()
              , g = function(e) {
                function a(a, t, r, o, s) {
                    var p = e.call(this) || this;
                    return p.id = a,
                    p.typeDef = t,
                    p.worker = r,
                    p.isFunction = o,
                    p.cache = new Map,
                    p.proxyFunction = o ? (0,
                    n().createProxyFunction)(s, a, r) : void 0,
                    p.cast = function(e) {
                        return (0,
                        i().__cast)(e, p.typeDef)
                    }
                    ,
                    p
                }
                return (0,
                r().__extends)(a, e),
                a.create = function(e, t, r, i) {
                    var o = (0,
                    u().isFunctionType)(t)
                      , n = o ? function() {}
                    : b;
                    return new Proxy(n,new a(e,t,r,o,i))
                }
                ,
                a.prototype.get = function(e, a, t) {
                    var r, i;
                    if (a === o().HIDDEN_SCOPE_PATH)
                        return this.id;
                    if ("string" == typeof a) {
                        if (a === o().GLOAL_SCOPE)
                            return this.worker.scope.getScopeProxy();
                        if (a === o().CAST)
                            return this.cast;
                        if ((this.typeDef.hasOwnProperty(a) || (0,
                        u().isPrivateProperty)(this.typeDef, a)) && (0,
                        u().isProperty)(a)) {
                            var s = this.typeDef[a];
                            if (!(s && (0,
                            u().isFunctionType)(s)))
                                return this.worker.postAndWait((0,
                                l().createGetMessage)(this.worker.createSeqId(), p().createPath(this.id, a)));
                            if (!this.cache.has(a)) {
                                var c = (0,
                                u().asExtendedTypeDef)(s)
                                  , f = !!this.worker.isPerformanceInsightToolEnabled() && !!(null === (i = null === (r = this.typeDef["!tmp-proto-chain"]) || void 0 === r ? void 0 : r[0]) || void 0 === i ? void 0 : i.startsWith("DynamicTypes."));
                                this.cache.set(a, (0,
                                n().createProxyOrCustomFunction)(this.id, a, this.worker, c, t, f))
                            }
                            return this.cache.get(a)
                        }
                    }
                }
                ,
                a.prototype.set = function(e, a, t) {
                    return "string" == typeof a && (this.worker.postDontWait((0,
                    l().createSetMessage)(this.worker.createSeqId(), p().createPath(this.id, a), t)),
                    !0)
                }
                ,
                a.prototype.apply = function(e, a, t) {
                    if (void 0 !== this.proxyFunction)
                        return this.proxyFunction.apply(a, t)
                }
                ,
                a.prototype.getPrototypeOf = function(e) {
                    return this.isFunction ? Function.prototype : null
                }
                ,
                a
            }(m)
              , d = function(e) {
                function a(a) {
                    var t = e.call(this) || this;
                    return t.backend = a,
                    t
                }
                return (0,
                r().__extends)(a, e),
                a.prototype.get = function(e, a, t) {
                    if ("string" == typeof a)
                        return this.backend.get(a)
                }
                ,
                a.prototype.set = function(e, a, t) {
                    return "string" == typeof a && (this.backend.set(a, t),
                    !0)
                }
                ,
                a.prototype.ownKeys = function(e) {
                    return this.backend.ownKeys()
                }
                ,
                a
            }(m);
            a.ProxiesScope = function(e) {
                function a(a, t) {
                    var r = e.call(this, t, a) || this
                      , i = new d(r);
                    return r.scopeAsProxy = new Proxy(b,i),
                    r
                }
                return (0,
                r().__extends)(a, e),
                a.prototype.createProxy = function(e, a) {
                    return g.create(e, a, this.worker)
                }
                ,
                a.prototype.getScopeProxy = function() {
                    return this.scopeAsProxy
                }
                ,
                a
            }(s().AbstractScopeBackend)
        },
        650: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(114);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(72);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n(e, a, t) {
                var o = this;
                return function() {
                    for (var n = [], s = 0; s < arguments.length; s++)
                        n[s] = arguments[s];
                    return (0,
                    r().__awaiter)(o, void 0, Promise, function() {
                        return (0,
                        r().__generator)(this, function(r) {
                            return [2, t.postAndWait((0,
                            i().createCallMessage)(t.createSeqId(), e, a, n))]
                        })
                    })
                }
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.createProxyFunction = n,
            a.createProxyOrCustomFunction = function(e, a, t, s, p, l) {
                var u, c = this;
                return (0,
                o().isCustomFunction)(s) ? function() {
                    for (var o = [], n = 0; n < arguments.length; n++)
                        o[n] = arguments[n];
                    return (0,
                    r().__awaiter)(c, void 0, Promise, function() {
                        var n, s;
                        return (0,
                        r().__generator)(this, function(r) {
                            switch (r.label) {
                            case 0:
                                if (u)
                                    return [3, 2];
                                return [4, t.postAndWait((0,
                                i().createLoadFunctionMessage)(t.createSeqId(), e, a))];
                            case 1:
                                if ("function" != typeof (n = r.sent()))
                                    return console.error("SandboxWorker: Expected custom function, but was: ", typeof n),
                                    [2, void 0];
                                u = n,
                                r.label = 2;
                            case 2:
                                return l && t.logPerTime("start", "".concat(e, ".").concat(a)),
                                s = u.apply(p, o),
                                l && (s instanceof Promise ? s.finally(function() {
                                    t.logPerTime("end", "".concat(e, ".").concat(a))
                                }) : t.logPerTime("end", "".concat(e, ".").concat(a))),
                                [2, s]
                            }
                        })
                    })
                }
                : n(e, a, t)
            }
        },
        1836: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = t(1018);
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = m(t(1837));
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n() {
                let e = t(1839);
                return n = function() {
                    return e
                }
                ,
                e
            }
            function s() {
                let e = m(t(85));
                return s = function() {
                    return e
                }
                ,
                e
            }
            function p() {
                let e = m(t(1840));
                return p = function() {
                    return e
                }
                ,
                e
            }
            function l() {
                let e = m(t(1842));
                return l = function() {
                    return e
                }
                ,
                e
            }
            function u() {
                let e = m(t(61));
                return u = function() {
                    return e
                }
                ,
                e
            }
            function c() {
                let e = t(114);
                return c = function() {
                    return e
                }
                ,
                e
            }
            function f() {
                let e = t(318);
                return f = function() {
                    return e
                }
                ,
                e
            }
            function b(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (b = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            function m(e, a) {
                if (!a && e && e.__esModule)
                    return e;
                if (null === e || "object" != typeof e && "function" != typeof e)
                    return {
                        default: e
                    };
                var t = b(a);
                if (t && t.has(e))
                    return t.get(e);
                var r = {
                    __proto__: null
                }
                  , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var o in e)
                    if ("default" !== o && ({}).hasOwnProperty.call(e, o)) {
                        var n = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                        n && (n.get || n.set) ? Object.defineProperty(r, o, n) : r[o] = e[o]
                    }
                return r.default = e,
                t && t.set(e, r),
                r
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.StandaloneClient = a.SandboxRuntime = void 0;
            var g = a.SandboxRuntime = function() {
                function e(e) {
                    this._seqId = 0,
                    this._waitingPromises = {},
                    this.queuedUpdates = [],
                    this.sendMessage = e,
                    this.knowledgeBaseInterpreter = new (i()).KnowledgeBaseInterpreter,
                    (0,
                    n().wrapConsoleLog)()
                }
                return e.prototype.onmessage = function(e) {
                    var a = this;
                    this.handleMessage(e).catch(function(e) {
                        a.postError(e)
                    })
                }
                ,
                e.prototype.logPerTime = function(e, a) {
                    this.sendMessage({
                        type: u().WorkerMessageType.logPerTime,
                        key: a,
                        startOrEnd: e
                    })
                }
                ,
                e.prototype.handleMessage = function(e) {
                    var a, t;
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        return (0,
                        r().__generator)(this, function(r) {
                            switch (r.label) {
                            case 0:
                                if (!u().isClientMessage(e))
                                    return [3, 7];
                                switch (this.logMessage(e),
                                e.type) {
                                case u().ClientMessageType.run:
                                    return [3, 1];
                                case u().ClientMessageType.continue:
                                    return [3, 3];
                                case u().ClientMessageType.loadFunctionResult:
                                    return [3, 4]
                                }
                                return [3, 6];
                            case 1:
                                return "object" == typeof e.init && this.init(e.init.scope, e.init.types, e.init.config, null === (a = e.init) || void 0 === a ? void 0 : a.tracked),
                                "object" == typeof e.updates && this.updateScope(e.updates.scope, null === (t = e.updates) || void 0 === t ? void 0 : t.tracked),
                                [4, this.runScript(e.script, e.self, e.args)];
                            case 2:
                            case 5:
                                return r.sent(),
                                [3, 7];
                            case 3:
                                return this.runContinuation(e.seqId, e.result),
                                [3, 7];
                            case 4:
                                return [4, this.handleLoadFunctionResultMessage(e.seqId, e.funcDef)];
                            case 6:
                                return this.postError('SandboxRuntime: Unknown message type "'.concat(e.type, '"')),
                                [3, 7];
                            case 7:
                                return [2]
                            }
                        })
                    })
                }
                ,
                e.prototype.logMessage = function(e) {
                    var a;
                    void 0 !== this.debug ? a = this.debug : u().isRunMessage(e) && void 0 !== e.init && void 0 !== e.init.config && (a = e.init.config.debug),
                    a && console.debug("SandboxRuntime.onmessage", e)
                }
                ,
                e.prototype.init = function(e, a, t, r) {
                    void 0 === t && (t = {}),
                    void 0 === r && (r = []);
                    var i, n, s, p = null === (i = t.useProxies) || void 0 === i || i, l = null === (n = t.useAsync) || void 0 === n || n;
                    this.debug = null !== (s = t.debug) && void 0 !== s && s,
                    this.isPerformanceToolEnabled = !!t.performanceToolEnabled,
                    this.types = a,
                    this.trackedProps = r,
                    this.scope = this.createProxyScope(e, p),
                    this.asyncFunctionFactoryPromise = o().load(l, this.debug)
                }
                ,
                e.prototype.isPerformanceInsightToolEnabled = function() {
                    return this.isPerformanceToolEnabled
                }
                ,
                e.prototype.updateScope = function(e, a) {
                    var t = this;
                    e && Object.getOwnPropertyNames(e).forEach(function(a) {
                        var r = e[a];
                        r && t.scope.updateProp(a, r)
                    }),
                    a && a.length > 0 && a !== this.trackedProps && (this.trackedProps = a)
                }
                ,
                e.prototype.createThisPointer = function(e) {
                    var a = e ? this.scope.get(e) : void 0;
                    if ("object" == typeof a && null !== a)
                        return a;
                    var t = {}
                      , r = this;
                    return Object.defineProperty(t, s().GLOAL_SCOPE, {
                        get: function() {
                            return r.scope.getScopeProxy()
                        }
                    }),
                    t
                }
                ,
                e.prototype.runScript = function(e, a, t) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var i, o, n, s, p;
                        return (0,
                        r().__generator)(this, function(r) {
                            switch (r.label) {
                            case 0:
                                i = this.createThisPointer(a),
                                r.label = 1;
                            case 1:
                                return r.trys.push([1, 4, , 5]),
                                o = (0,
                                c().unmarshallArguments)(t, this.scope),
                                [4, this.createFunction(e, o.names)];
                            case 2:
                                return [4, r.sent().apply(i, o.values)];
                            case 3:
                                return n = r.sent(),
                                s = (0,
                                c().createResultMessage)(n),
                                this.postDontWait(s),
                                [3, 5];
                            case 4:
                                return p = r.sent(),
                                this.postError(p),
                                [3, 5];
                            case 5:
                                return [2]
                            }
                        })
                    })
                }
                ,
                e.prototype.createFunction = function(e, a) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var t;
                        return (0,
                        r().__generator)(this, function(r) {
                            switch (r.label) {
                            case 0:
                                return t = "'use strict';\n".concat(e),
                                [4, this.asyncFunctionFactoryPromise];
                            case 1:
                                return [2, r.sent()(t, a)]
                            }
                        })
                    })
                }
                ,
                e.prototype.handleLoadFunctionResultMessage = function(e, a) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var t, i, o, n = this;
                        return (0,
                        r().__generator)(this, function(r) {
                            switch (r.label) {
                            case 0:
                                if (!(t = this.getAndRemoveWaitingPromise(e)))
                                    return [3, 6];
                                if (!a)
                                    return [3, 4];
                                if (!Array.isArray(a))
                                    return [3, 1];
                                return i = function(e) {
                                    return n.knowledgeBaseInterpreter.execute(a, e)
                                }
                                ,
                                t.callResolve(i),
                                [3, 3];
                            case 1:
                                return [4, this.createFunction(a.body, a.args)];
                            case 2:
                                o = r.sent(),
                                t.callResolve(o),
                                r.label = 3;
                            case 3:
                                return [3, 5];
                            case 4:
                                t.callResolve(void 0),
                                r.label = 5;
                            case 5:
                                return [3, 7];
                            case 6:
                                this.postError("SandboxWorker: No continuation pending"),
                                r.label = 7;
                            case 7:
                                return [2]
                            }
                        })
                    })
                }
                ,
                e.prototype.runContinuation = function(e, a) {
                    var t = this.getAndRemoveWaitingPromise(e);
                    if (t) {
                        var r = (0,
                        c().unmarshall)(a, this.scope);
                        t.callResolve(r)
                    } else
                        this.postError("SandboxWorker: No continuation pending")
                }
                ,
                e.prototype.notifyPropChanged = function(e) {
                    this.queuedUpdates.push(e)
                }
                ,
                e.prototype.addUpdates = function(e, a) {
                    var t, i;
                    if (a.length > 0) {
                        e.updates = e.updates || {};
                        try {
                            for (var o = (0,
                            r().__values)(a), n = o.next(); !n.done; n = o.next()) {
                                var s = n.value
                                  , p = this.scope.getForTransport(s);
                                e.updates[s] = p
                            }
                        } catch (e) {
                            t = {
                                error: e
                            }
                        } finally {
                            try {
                                n && !n.done && (i = o.return) && i.call(o)
                            } finally {
                                if (t)
                                    throw t.error
                            }
                        }
                    }
                    return e
                }
                ,
                e.prototype.postAndWait = function(e) {
                    return (0,
                    r().__awaiter)(this, void 0, void 0, function() {
                        return (0,
                        r().__generator)(this, function(a) {
                            return [2, this._post(e, !0)]
                        })
                    })
                }
                ,
                e.prototype.postDontWait = function(e) {
                    this._post(e, !1).catch(function(e) {
                        return console.error("SandboxWorker: Uncaught error: ", e)
                    })
                }
                ,
                e.prototype.postError = function(e) {
                    this.postDontWait((0,
                    c().createErrorMessage)(e))
                }
                ,
                e.prototype._post = function(e, a) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        var t, i;
                        return (0,
                        r().__generator)(this, function(r) {
                            a && void 0 !== e.seqId && (t = (0,
                            f().createWaitingPromise)(),
                            this._waitingPromises[e.seqId] = t),
                            i = this.queuedUpdates,
                            this.addUpdates(e, i),
                            this.queuedUpdates = [];
                            try {
                                return this.sendMessage(e),
                                [2, t || Promise.resolve(void 0)]
                            } catch (a) {
                                return this.getAndRemoveWaitingPromise(e.seqId),
                                this.postError(a),
                                [2, Promise.resolve(void 0)]
                            }
                            return [2]
                        })
                    })
                }
                ,
                e.prototype.createProxyScope = function(e, a) {
                    return "undefined" != typeof Proxy && a ? new (l()).ProxiesScope(this,e) : new (p()).NoProxiesScope(this,e)
                }
                ,
                e.prototype.createSeqId = function() {
                    return this._seqId++
                }
                ,
                e.prototype.getAndRemoveWaitingPromise = function(e) {
                    if (void 0 !== e) {
                        var a = this._waitingPromises[e];
                        return delete this._waitingPromises[e],
                        a
                    }
                }
                ,
                e
            }();
            a.StandaloneClient = function() {
                function e() {}
                return e.prototype.attach = function(e, a) {
                    return (0,
                    r().__awaiter)(this, void 0, Promise, function() {
                        return (0,
                        r().__generator)(this, function(t) {
                            return this.runtime = new g(e),
                            this.errorHandler = a,
                            [2]
                        })
                    })
                }
                ,
                e.prototype.postMessage = function(e) {
                    try {
                        void 0 !== this.runtime && this.runtime.onmessage(e)
                    } catch (e) {
                        void 0 !== this.errorHandler ? this.errorHandler(e.message) : console.error(e)
                    }
                }
                ,
                e.prototype.dispose = function() {
                    this.runtime = void 0,
                    this.errorHandler = void 0
                }
                ,
                e
            }()
        },
        1835: function(e, a, t) {
            function r() {
                let e = t(1836);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.initWorker = function() {
                var e = new (r()).SandboxRuntime(function(e) {
                    self.postMessage(e)
                }
                );
                self.onmessage = function(a) {
                    e.onmessage(a.data)
                }
            }
        },
        1834: function(e, a, t) {
            function r() {
                let e = t(1835);
                return r = function() {
                    return e
                }
                ,
                e
            }
            (0,
            r().initWorker)()
        },
        61: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.WorkerMessageType = a.PATH_SEPARATOR = a.ClientMessageType = void 0,
            a.convertEach = function(e, a) {
                return e.map(function(e) {
                    return a(e)
                })
            }
            ,
            a.convertEachAsync = function(e, a) {
                return (0,
                r().__awaiter)(this, void 0, Promise, function() {
                    var t, i, o, n, s, p, l, u;
                    return (0,
                    r().__generator)(this, function(c) {
                        switch (c.label) {
                        case 0:
                            t = [],
                            c.label = 1;
                        case 1:
                            c.trys.push([1, 6, 7, 8]),
                            o = (i = (0,
                            r().__values)(e)).next(),
                            c.label = 2;
                        case 2:
                            if (o.done)
                                return [3, 5];
                            return n = o.value,
                            p = (s = t).push,
                            [4, a(n)];
                        case 3:
                            p.apply(s, [c.sent()]),
                            c.label = 4;
                        case 4:
                            return o = i.next(),
                            [3, 2];
                        case 5:
                            return [3, 8];
                        case 6:
                            return l = {
                                error: c.sent()
                            },
                            [3, 8];
                        case 7:
                            try {
                                o && !o.done && (u = i.return) && u.call(i)
                            } finally {
                                if (l)
                                    throw l.error
                            }
                            return [7];
                        case 8:
                            return [2, t]
                        }
                    })
                })
            }
            ,
            a.createPath = function() {
                for (var e = [], a = 0; a < arguments.length; a++)
                    e[a] = arguments[a];
                return e.join(p)
            }
            ,
            a.getConfig = function(e) {
                return void 0 !== e.init && void 0 !== e.init.config ? e.init.config : {}
            }
            ,
            a.isClientMessage = function(e) {
                return void 0 !== e && e.hasOwnProperty("type")
            }
            ,
            a.isPrimitive = function(e) {
                return e.hasOwnProperty("value")
            }
            ,
            a.isReference = function(e) {
                return null != e && e.hasOwnProperty("ref")
            }
            ,
            a.isRunMessage = function(e) {
                return void 0 !== e && e.hasOwnProperty("type") && e.type === s.run
            }
            ,
            a.isWindowMessage = function(e) {
                return "object" == typeof e && "string" == typeof e.clientId
            }
            ,
            a.isWorkerMessage = function(e) {
                return void 0 !== e && e.hasOwnProperty("type")
            }
            ,
            a.pathToArray = function(e) {
                return e.split(p)
            }
            ,
            (i = n || (a.WorkerMessageType = n = {}))[i.get = 0] = "get",
            i[i.set = 1] = "set",
            i[i.result = 2] = "result",
            i[i.call = 3] = "call",
            i[i.loadFunc = 4] = "loadFunc",
            i[i.error = 5] = "error",
            i[i._dummy = 6] = "_dummy",
            i[i.logPerTime = 7] = "logPerTime",
            (o = s || (a.ClientMessageType = s = {}))[o.continue = 0] = "continue",
            o[o.run = 1] = "run",
            o[o.loadFunctionResult = 2] = "loadFunctionResult",
            o[o._dummy = 3] = "_dummy";
            var i, o, n, s, p = a.PATH_SEPARATOR = "."
        },
        114: function(e, a, t) {
            function r() {
                let e = s(t(85));
                return r = function() {
                    return e
                }
                ,
                e
            }
            function i() {
                let e = s(t(61));
                return i = function() {
                    return e
                }
                ,
                e
            }
            function o() {
                let e = t(72);
                return o = function() {
                    return e
                }
                ,
                e
            }
            function n(e) {
                if ("function" != typeof WeakMap)
                    return null;
                var a = new WeakMap
                  , t = new WeakMap;
                return (n = function(e) {
                    return e ? t : a
                }
                )(e)
            }
            function s(e, a) {
                if (!a && e && e.__esModule)
                    return e;
                if (null === e || "object" != typeof e && "function" != typeof e)
                    return {
                        default: e
                    };
                var t = n(a);
                if (t && t.has(e))
                    return t.get(e);
                var r = {
                    __proto__: null
                }
                  , i = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var o in e)
                    if ("default" !== o && ({}).hasOwnProperty.call(e, o)) {
                        var s = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                        s && (s.get || s.set) ? Object.defineProperty(r, o, s) : r[o] = e[o]
                    }
                return r.default = e,
                t && t.set(e, r),
                r
            }
            function p(e) {
                if (null != e)
                    return e[r().HIDDEN_SCOPE_PATH]
            }
            function l(e, a) {
                void 0 === a && (a = "*");
                var t = p(e);
                return void 0 !== t ? {
                    ref: t,
                    type: "*"
                } : (0,
                o().isPrimitiveType)(a) ? {
                    value: e,
                    type: a
                } : {
                    value: function e(a) {
                        var t = p(a);
                        return void 0 !== t ? {
                            ref: t,
                            type: "*"
                        } : Array.isArray(a) ? i().convertEach(a, e) : a
                    }(e),
                    type: "*"
                }
            }
            function u(e, a) {
                return i().isReference(e) ? c(e, a) : function e(a, t, r) {
                    return i().isReference(a) ? c(a, t) : Array.isArray(a) ? r && (0,
                    o().isPrimitiveType)(r) ? a.slice() : i().convertEach(a, function(a) {
                        return e(a, t)
                    }) : a
                }(e.value, a, e.type)
            }
            function c(e, a) {
                return a.updateProp(e.ref, e)
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.createCallMessage = function(e, a, t, r) {
                var o = void 0 !== a ? a : "";
                return {
                    seqId: e,
                    type: i().WorkerMessageType.call,
                    path: i().createPath(o, t),
                    args: r.map(function(e) {
                        return l(e)
                    })
                }
            }
            ,
            a.createErrorMessage = function(e) {
                var a = "string" == typeof e ? e : e.message
                  , t = "string" == typeof e ? void 0 : e.stack;
                return {
                    type: i().WorkerMessageType.error,
                    msg: a,
                    stack: t
                }
            }
            ,
            a.createGetMessage = function(e, a) {
                return {
                    seqId: e,
                    type: i().WorkerMessageType.get,
                    path: a
                }
            }
            ,
            a.createLoadFunctionMessage = function(e, a, t) {
                var r = void 0 !== a ? a : "";
                return {
                    seqId: e,
                    type: i().WorkerMessageType.loadFunc,
                    path: i().createPath(r, t)
                }
            }
            ,
            a.createResultMessage = function(e) {
                var a = l(e);
                return {
                    type: i().WorkerMessageType.result,
                    value: a
                }
            }
            ,
            a.createSetMessage = function(e, a, t, r) {
                var o = l(t, r);
                return {
                    seqId: e,
                    type: i().WorkerMessageType.set,
                    path: a,
                    value: o
                }
            }
            ,
            a.marshall = l,
            a.unmarshall = u,
            a.unmarshallArguments = function(e, a) {
                var t = e.values.map(function(e) {
                    return u(e, a)
                });
                return {
                    names: e.names,
                    values: t
                }
            }
        },
        72: function(e, a, t) {
            function r() {
                let e = t(3);
                return r = function() {
                    return e
                }
                ,
                e
            }
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.asExtendedTypeDef = function(e) {
                return "string" == typeof e ? {
                    "!type": e
                } : e
            }
            ,
            a.getPrivateProperties = function(e) {
                var a = e["!data"];
                return "object" == typeof a && void 0 !== a.privateProperties ? Object.keys(a.privateProperties) : []
            }
            ,
            a.getTypeDefinition = function e(a, t) {
                if (void 0 !== t) {
                    "+" === t[0] ? (l = (p = t.substring(1)).split(".")).push("prototype") : (l = t.split("."),
                    p = t.endsWith(".prototype") ? t.substring(0, t.length - 10) : t);
                    try {
                        for (var i, n, s, p, l, u, c = (0,
                        r().__values)(a), f = c.next(); !f.done; f = c.next()) {
                            var b = f.value;
                            if (u = o(b, l),
                            void 0 === u && (u = o(b, (0,
                            r().__spreadArray)(["!define"], (0,
                            r().__read)(l), !1))),
                            void 0 !== u)
                                break
                        }
                    } catch (e) {
                        i = {
                            error: e
                        }
                    } finally {
                        try {
                            f && !f.done && (n = c.return) && n.call(c)
                        } finally {
                            if (i)
                                throw i.error
                        }
                    }
                    if (void 0 !== u) {
                        u["!tmp-proto-chain"] = [p];
                        var m = u["!proto"] && e(a, u["!proto"]);
                        m && m["!tmp-proto-chain"] && (u = (0,
                        r().__assign)((0,
                        r().__assign)({}, m), u),
                        delete u["!proto"],
                        null === (s = u["!tmp-proto-chain"]) || void 0 === s || s.push.apply(s, (0,
                        r().__spreadArray)([], (0,
                        r().__read)(m["!tmp-proto-chain"]), !1)))
                    }
                    return u
                }
            }
            ,
            a.isCustomFunction = function(e) {
                var a = e["!data"];
                return !!(null == a ? void 0 : a.customFunction)
            }
            ,
            a.isFunctionType = function e(a) {
                return "object" == typeof a && a && a.hasOwnProperty("!type") && !Array.isArray(a) ? e(a["!type"]) : "string" == typeof a && 0 === a.indexOf("fn(")
            }
            ,
            a.isGlobal = function(e) {
                var a = e["!data"];
                return !!(null == a ? void 0 : a.isGlobal)
            }
            ,
            a.isPrimitiveType = function(e) {
                return i.includes(e)
            }
            ,
            a.isPrivateProperty = function(e, a) {
                var t = e["!data"];
                return "object" == typeof t && void 0 !== t.privateProperties && void 0 !== t.privateProperties[a]
            }
            ,
            a.isProperty = function(e) {
                return e.length > 0 && "!" !== e[0]
            }
            ;
            var i = ["string", "bool", "number", "integer", "[string]", "[bool]", "[number]", "[integer]"];
            function o(e, a) {
                var t = a.length;
                if (!(t < 1))
                    for (var r = e, i = 0; i < t; i++) {
                        var o = a[i];
                        if ("object" == typeof r) {
                            if (r = r[o],
                            i === t - 1)
                                return r
                        } else
                            break
                    }
            }
        },
        318: function(e, a) {
            Object.defineProperty(a, "__esModule", {
                value: !0
            }),
            a.wrapWithWaitingPromise = a.createWaitingPromise = void 0;
            var t = function() {
                var e, a, t = new Promise(function(t, r) {
                    e = t,
                    a = r
                }
                );
                return t.state = "pending",
                t.callResolve = function(a) {
                    t.state = "resolved",
                    e(a)
                }
                ,
                t.callReject = function(e) {
                    t.state = "rejected",
                    a(e)
                }
                ,
                t
            };
            a.createWaitingPromise = t,
            a.wrapWithWaitingPromise = function(e) {
                var a = t();
                return e.then(a.callResolve).catch(a.callReject),
                a
            }
        },
        3: function(e, a, t) {
            "use strict";
            t.r(a),
            t.d(a, {
                __addDisposableResource: function() {
                    return O
                },
                __assign: function() {
                    return o
                },
                __asyncDelegator: function() {
                    return B
                },
                __asyncGenerator: function() {
                    return F
                },
                __asyncValues: function() {
                    return P
                },
                __await: function() {
                    return w
                },
                __awaiter: function() {
                    return m
                },
                __classPrivateFieldGet: function() {
                    return _
                },
                __classPrivateFieldIn: function() {
                    return E
                },
                __classPrivateFieldSet: function() {
                    return x
                },
                __createBinding: function() {
                    return d
                },
                __decorate: function() {
                    return s
                },
                __disposeResources: function() {
                    return L
                },
                __esDecorate: function() {
                    return l
                },
                __exportStar: function() {
                    return v
                },
                __extends: function() {
                    return i
                },
                __generator: function() {
                    return g
                },
                __importDefault: function() {
                    return T
                },
                __importStar: function() {
                    return D
                },
                __makeTemplateObject: function() {
                    return M
                },
                __metadata: function() {
                    return b
                },
                __param: function() {
                    return p
                },
                __propKey: function() {
                    return c
                },
                __read: function() {
                    return y
                },
                __rest: function() {
                    return n
                },
                __runInitializers: function() {
                    return u
                },
                __setFunctionName: function() {
                    return f
                },
                __spread: function() {
                    return h
                },
                __spreadArray: function() {
                    return S
                },
                __spreadArrays: function() {
                    return C
                },
                __values: function() {
                    return k
                },
                default: function() {
                    return z
                }
            });
            var r = function(e, a) {
                return (r = Object.setPrototypeOf || ({
                    __proto__: []
                })instanceof Array && function(e, a) {
                    e.__proto__ = a
                }
                || function(e, a) {
                    for (var t in a)
                        Object.prototype.hasOwnProperty.call(a, t) && (e[t] = a[t])
                }
                )(e, a)
            };
            function i(e, a) {
                if ("function" != typeof a && null !== a)
                    throw TypeError("Class extends value " + String(a) + " is not a constructor or null");
                function t() {
                    this.constructor = e
                }
                r(e, a),
                e.prototype = null === a ? Object.create(a) : (t.prototype = a.prototype,
                new t)
            }
            var o = function() {
                return (o = Object.assign || function(e) {
                    for (var a, t = 1, r = arguments.length; t < r; t++)
                        for (var i in a = arguments[t])
                            Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
                    return e
                }
                ).apply(this, arguments)
            };
            function n(e, a) {
                var t = {};
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && 0 > a.indexOf(r) && (t[r] = e[r]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols)
                    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
                        0 > a.indexOf(r[i]) && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (t[r[i]] = e[r[i]]);
                return t
            }
            function s(e, a, t, r) {
                var i, o = arguments.length, n = o < 3 ? a : null === r ? r = Object.getOwnPropertyDescriptor(a, t) : r;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    n = Reflect.decorate(e, a, t, r);
                else
                    for (var s = e.length - 1; s >= 0; s--)
                        (i = e[s]) && (n = (o < 3 ? i(n) : o > 3 ? i(a, t, n) : i(a, t)) || n);
                return o > 3 && n && Object.defineProperty(a, t, n),
                n
            }
            function p(e, a) {
                return function(t, r) {
                    a(t, r, e)
                }
            }
            function l(e, a, t, r, i, o) {
                function n(e) {
                    if (void 0 !== e && "function" != typeof e)
                        throw TypeError("Function expected");
                    return e
                }
                for (var s, p = r.kind, l = "getter" === p ? "get" : "setter" === p ? "set" : "value", u = !a && e ? r.static ? e : e.prototype : null, c = a || (u ? Object.getOwnPropertyDescriptor(u, r.name) : {}), f = !1, b = t.length - 1; b >= 0; b--) {
                    var m = {};
                    for (var g in r)
                        m[g] = "access" === g ? {} : r[g];
                    for (var g in r.access)
                        m.access[g] = r.access[g];
                    m.addInitializer = function(e) {
                        if (f)
                            throw TypeError("Cannot add initializers after decoration has completed");
                        o.push(n(e || null))
                    }
                    ;
                    var d = (0,
                    t[b])("accessor" === p ? {
                        get: c.get,
                        set: c.set
                    } : c[l], m);
                    if ("accessor" === p) {
                        if (void 0 === d)
                            continue;
                        if (null === d || "object" != typeof d)
                            throw TypeError("Object expected");
                        (s = n(d.get)) && (c.get = s),
                        (s = n(d.set)) && (c.set = s),
                        (s = n(d.init)) && i.unshift(s)
                    } else
                        (s = n(d)) && ("field" === p ? i.unshift(s) : c[l] = s)
                }
                u && Object.defineProperty(u, r.name, c),
                f = !0
            }
            function u(e, a, t) {
                for (var r = arguments.length > 2, i = 0; i < a.length; i++)
                    t = r ? a[i].call(e, t) : a[i].call(e);
                return r ? t : void 0
            }
            function c(e) {
                return "symbol" == typeof e ? e : "".concat(e)
            }
            function f(e, a, t) {
                return "symbol" == typeof a && (a = a.description ? "[".concat(a.description, "]") : ""),
                Object.defineProperty(e, "name", {
                    configurable: !0,
                    value: t ? "".concat(t, " ", a) : a
                })
            }
            function b(e, a) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
                    return Reflect.metadata(e, a)
            }
            function m(e, a, t, r) {
                return new (t || (t = Promise))(function(i, o) {
                    function n(e) {
                        try {
                            p(r.next(e))
                        } catch (e) {
                            o(e)
                        }
                    }
                    function s(e) {
                        try {
                            p(r.throw(e))
                        } catch (e) {
                            o(e)
                        }
                    }
                    function p(e) {
                        var a;
                        e.done ? i(e.value) : ((a = e.value)instanceof t ? a : new t(function(e) {
                            e(a)
                        }
                        )).then(n, s)
                    }
                    p((r = r.apply(e, a || [])).next())
                }
                )
            }
            function g(e, a) {
                var t, r, i, o, n = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0])
                            throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return o = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                },
                "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                    return this
                }
                ),
                o;
                function s(s) {
                    return function(p) {
                        return function(s) {
                            if (t)
                                throw TypeError("Generator is already executing.");
                            for (; o && (o = 0,
                            s[0] && (n = 0)),
                            n; )
                                try {
                                    if (t = 1,
                                    r && (i = 2 & s[0] ? r.return : s[0] ? r.throw || ((i = r.return) && i.call(r),
                                    0) : r.next) && !(i = i.call(r, s[1])).done)
                                        return i;
                                    switch (r = 0,
                                    i && (s = [2 & s[0], i.value]),
                                    s[0]) {
                                    case 0:
                                    case 1:
                                        i = s;
                                        break;
                                    case 4:
                                        return n.label++,
                                        {
                                            value: s[1],
                                            done: !1
                                        };
                                    case 5:
                                        n.label++,
                                        r = s[1],
                                        s = [0];
                                        continue;
                                    case 7:
                                        s = n.ops.pop(),
                                        n.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = n.trys).length > 0 && i[i.length - 1]) && (6 === s[0] || 2 === s[0])) {
                                            n = 0;
                                            continue
                                        }
                                        if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
                                            n.label = s[1];
                                            break
                                        }
                                        if (6 === s[0] && n.label < i[1]) {
                                            n.label = i[1],
                                            i = s;
                                            break
                                        }
                                        if (i && n.label < i[2]) {
                                            n.label = i[2],
                                            n.ops.push(s);
                                            break
                                        }
                                        i[2] && n.ops.pop(),
                                        n.trys.pop();
                                        continue
                                    }
                                    s = a.call(e, n)
                                } catch (e) {
                                    s = [6, e],
                                    r = 0
                                } finally {
                                    t = i = 0
                                }
                            if (5 & s[0])
                                throw s[1];
                            return {
                                value: s[0] ? s[1] : void 0,
                                done: !0
                            }
                        }([s, p])
                    }
                }
            }
            var d = Object.create ? function(e, a, t, r) {
                void 0 === r && (r = t);
                var i = Object.getOwnPropertyDescriptor(a, t);
                (!i || ("get"in i ? !a.__esModule : i.writable || i.configurable)) && (i = {
                    enumerable: !0,
                    get: function() {
                        return a[t]
                    }
                }),
                Object.defineProperty(e, r, i)
            }
            : function(e, a, t, r) {
                void 0 === r && (r = t),
                e[r] = a[t]
            }
            ;
            function v(e, a) {
                for (var t in e)
                    "default" === t || Object.prototype.hasOwnProperty.call(a, t) || d(a, e, t)
            }
            function k(e) {
                var a = "function" == typeof Symbol && Symbol.iterator
                  , t = a && e[a]
                  , r = 0;
                if (t)
                    return t.call(e);
                if (e && "number" == typeof e.length)
                    return {
                        next: function() {
                            return e && r >= e.length && (e = void 0),
                            {
                                value: e && e[r++],
                                done: !e
                            }
                        }
                    };
                throw TypeError(a ? "Object is not iterable." : "Symbol.iterator is not defined.")
            }
            function y(e, a) {
                var t = "function" == typeof Symbol && e[Symbol.iterator];
                if (!t)
                    return e;
                var r, i, o = t.call(e), n = [];
                try {
                    for (; (void 0 === a || a-- > 0) && !(r = o.next()).done; )
                        n.push(r.value)
                } catch (e) {
                    i = {
                        error: e
                    }
                } finally {
                    try {
                        r && !r.done && (t = o.return) && t.call(o)
                    } finally {
                        if (i)
                            throw i.error
                    }
                }
                return n
            }
            function h() {
                for (var e = [], a = 0; a < arguments.length; a++)
                    e = e.concat(y(arguments[a]));
                return e
            }
            function C() {
                for (var e = 0, a = 0, t = arguments.length; a < t; a++)
                    e += arguments[a].length;
                for (var r = Array(e), i = 0, a = 0; a < t; a++)
                    for (var o = arguments[a], n = 0, s = o.length; n < s; n++,
                    i++)
                        r[i] = o[n];
                return r
            }
            function S(e, a, t) {
                if (t || 2 == arguments.length)
                    for (var r, i = 0, o = a.length; i < o; i++)
                        !r && i in a || (r || (r = Array.prototype.slice.call(a, 0, i)),
                        r[i] = a[i]);
                return e.concat(r || Array.prototype.slice.call(a))
            }
            function w(e) {
                return this instanceof w ? (this.v = e,
                this) : new w(e)
            }
            function F(e, a, t) {
                if (!Symbol.asyncIterator)
                    throw TypeError("Symbol.asyncIterator is not defined.");
                var r, i = t.apply(e, a || []), o = [];
                return r = {},
                n("next"),
                n("throw"),
                n("return"),
                r[Symbol.asyncIterator] = function() {
                    return this
                }
                ,
                r;
                function n(e) {
                    i[e] && (r[e] = function(a) {
                        return new Promise(function(t, r) {
                            o.push([e, a, t, r]) > 1 || s(e, a)
                        }
                        )
                    }
                    )
                }
                function s(e, a) {
                    try {
                        var t;
                        (t = i[e](a)).value instanceof w ? Promise.resolve(t.value.v).then(p, l) : u(o[0][2], t)
                    } catch (e) {
                        u(o[0][3], e)
                    }
                }
                function p(e) {
                    s("next", e)
                }
                function l(e) {
                    s("throw", e)
                }
                function u(e, a) {
                    e(a),
                    o.shift(),
                    o.length && s(o[0][0], o[0][1])
                }
            }
            function B(e) {
                var a, t;
                return a = {},
                r("next"),
                r("throw", function(e) {
                    throw e
                }),
                r("return"),
                a[Symbol.iterator] = function() {
                    return this
                }
                ,
                a;
                function r(r, i) {
                    a[r] = e[r] ? function(a) {
                        return (t = !t) ? {
                            value: w(e[r](a)),
                            done: !1
                        } : i ? i(a) : a
                    }
                    : i
                }
            }
            function P(e) {
                if (!Symbol.asyncIterator)
                    throw TypeError("Symbol.asyncIterator is not defined.");
                var a, t = e[Symbol.asyncIterator];
                return t ? t.call(e) : (e = k(e),
                a = {},
                r("next"),
                r("throw"),
                r("return"),
                a[Symbol.asyncIterator] = function() {
                    return this
                }
                ,
                a);
                function r(t) {
                    a[t] = e[t] && function(a) {
                        return new Promise(function(r, i) {
                            !function(e, a, t, r) {
                                Promise.resolve(r).then(function(a) {
                                    e({
                                        value: a,
                                        done: t
                                    })
                                }, a)
                            }(r, i, (a = e[t](a)).done, a.value)
                        }
                        )
                    }
                }
            }
            function M(e, a) {
                return Object.defineProperty ? Object.defineProperty(e, "raw", {
                    value: a
                }) : e.raw = a,
                e
            }
            var A = Object.create ? function(e, a) {
                Object.defineProperty(e, "default", {
                    enumerable: !0,
                    value: a
                })
            }
            : function(e, a) {
                e.default = a
            }
            ;
            function D(e) {
                if (e && e.__esModule)
                    return e;
                var a = {};
                if (null != e)
                    for (var t in e)
                        "default" !== t && Object.prototype.hasOwnProperty.call(e, t) && d(a, e, t);
                return A(a, e),
                a
            }
            function T(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            function _(e, a, t, r) {
                if ("a" === t && !r)
                    throw TypeError("Private accessor was defined without a getter");
                if ("function" == typeof a ? e !== a || !r : !a.has(e))
                    throw TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === t ? r : "a" === t ? r.call(e) : r ? r.value : a.get(e)
            }
            function x(e, a, t, r, i) {
                if ("m" === r)
                    throw TypeError("Private method is not writable");
                if ("a" === r && !i)
                    throw TypeError("Private accessor was defined without a setter");
                if ("function" == typeof a ? e !== a || !i : !a.has(e))
                    throw TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? i.call(e, t) : i ? i.value = t : a.set(e, t),
                t
            }
            function E(e, a) {
                if (null === a || "object" != typeof a && "function" != typeof a)
                    throw TypeError("Cannot use 'in' operator on non-object");
                return "function" == typeof e ? a === e : e.has(a)
            }
            function O(e, a, t) {
                if (null != a) {
                    var r;
                    if ("object" != typeof a && "function" != typeof a)
                        throw TypeError("Object expected.");
                    if (t) {
                        if (!Symbol.asyncDispose)
                            throw TypeError("Symbol.asyncDispose is not defined.");
                        r = a[Symbol.asyncDispose]
                    }
                    if (void 0 === r) {
                        if (!Symbol.dispose)
                            throw TypeError("Symbol.dispose is not defined.");
                        r = a[Symbol.dispose]
                    }
                    if ("function" != typeof r)
                        throw TypeError("Object not disposable.");
                    e.stack.push({
                        value: a,
                        dispose: r,
                        async: t
                    })
                } else
                    t && e.stack.push({
                        async: !0
                    });
                return a
            }
            var U = "function" == typeof SuppressedError ? SuppressedError : function(e, a, t) {
                var r = Error(t);
                return r.name = "SuppressedError",
                r.error = e,
                r.suppressed = a,
                r
            }
            ;
            function L(e) {
                function a(a) {
                    e.error = e.hasError ? new U(a,e.error,"An error was suppressed during disposal.") : a,
                    e.hasError = !0
                }
                return function t() {
                    for (; e.stack.length; ) {
                        var r = e.stack.pop();
                        try {
                            var i = r.dispose && r.dispose.call(r.value);
                            if (r.async)
                                return Promise.resolve(i).then(t, function(e) {
                                    return a(e),
                                    t()
                                })
                        } catch (e) {
                            a(e)
                        }
                    }
                    if (e.hasError)
                        throw e.error
                }()
            }
            let z = {
                __extends: i,
                __assign: o,
                __rest: n,
                __decorate: s,
                __param: p,
                __metadata: b,
                __awaiter: m,
                __generator: g,
                __createBinding: d,
                __exportStar: v,
                __values: k,
                __read: y,
                __spread: h,
                __spreadArrays: C,
                __spreadArray: S,
                __await: w,
                __asyncGenerator: F,
                __asyncDelegator: B,
                __asyncValues: P,
                __makeTemplateObject: M,
                __importStar: D,
                __importDefault: T,
                __classPrivateFieldGet: _,
                __classPrivateFieldSet: x,
                __classPrivateFieldIn: E,
                __addDisposableResource: O,
                __disposeResources: L
            }
        }
    }, u = {};
    function c(e) {
        var a = u[e];
        if (void 0 !== a)
            return a.exports;
        var t = u[e] = {
            exports: {}
        };
        return l[e](t, t.exports, c),
        t.exports
    }
    c.m = l,
    c.x = function() {
        c.O(void 0, [89], function() {
            return c(2788)
        }),
        c.O(void 0, [89], function() {
            return c(63)
        }),
        c.O(void 0, [89], function() {
            return c(414)
        });
        var e = c.O(void 0, [89], function() {
            return c(1834)
        });
        return c.O(e)
    }
    ,
    e = [],
    c.O = function(a, t, r, i) {
        if (t) {
            i = i || 0;
            for (var o = e.length; o > 0 && e[o - 1][2] > i; o--)
                e[o] = e[o - 1];
            e[o] = [t, r, i];
            return
        }
        for (var n = 1 / 0, o = 0; o < e.length; o++) {
            for (var [t,r,i] = e[o], s = !0, p = 0; p < t.length; p++)
                n >= i && Object.keys(c.O).every(function(e) {
                    return c.O[e](t[p])
                }) ? t.splice(p--, 1) : (s = !1,
                i < n && (n = i));
            if (s) {
                e.splice(o--, 1);
                var l = r();
                void 0 !== l && (a = l)
            }
        }
        return a
    }
    ,
    c.d = function(e, a) {
        for (var t in a)
            c.o(a, t) && !c.o(e, t) && Object.defineProperty(e, t, {
                enumerable: !0,
                get: a[t]
            })
    }
    ,
    c.f = {},
    c.e = function(e) {
        return Promise.all(Object.keys(c.f).reduce(function(a, t) {
            return c.f[t](e, a),
            a
        }, []))
    }
    ,
    c.u = function(e) {
        return 89 === e ? "uiAssets/89.main.27fd35ffa778e3dbf8a0.js" : "uiAssets/app.chunk." + (675 === e ? "sandboxTranspiler-chunk" : e) + "." + ({
            17: "567f14fe11e7fc84ec87",
            18: "831596eafd5745cdba8e",
            675: "0c1792a54298e4fdbba2"
        })[e] + ".js"
    }
    ,
    c.o = function(e, a) {
        return Object.prototype.hasOwnProperty.call(e, a)
    }
    ,
    c.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    c.p = "../";
    var f = {
        "sap.bi.context": [{}],
        "sap.bi.context.ContextDataType": [{}],
        "sap.bi.context.ContextEventRecorder": [{}],
        "sap.bi.context.EventDirection": [{}],
        "sap.bi.utilities.eventSupport": [{}],
        "sap.bi.utilities.logger": [{}],
        "sap.bi.utilities.WebWorkerLogger": [{}],
        "sap.bi.va.common.coreSpriteCSS": [{}],
        "sap.bi.va.common.visualXTabExplorerCSS": [{}],
        "sap.bi.va.common.Events": [{}],
        "sap.bi.va.cvomdataadapter.CvomChartDataFetcher": [{}],
        "sap.bi.va.cvomdataadapter.FilterConverter": [{}],
        "sap.bi.va.cvomdataadapter.WaterfallHelper": [{}],
        "sap.bi.va.cvomdataadapter.VizFireflyQueries": [{}],
        "sap.bi.va.cvomdataadapter.BuildFlatTableDataset": [{}],
        "sap.bi.va.cvomdataadapter.DatasetAutoRanker": [{}],
        "sap.bi.va.cvomdataadapter.GranularityHelper": [{}],
        "sap.bi.va.cvomdataadapter.PredictiveQueryBuilderHelper": [{}],
        "sap.bi.va.cvomdataadapter.QueryBuilderV3": [{}],
        "sap.bi.va.cvomdataadapter.QueryResultParser": [{}],
        "sap.bi.va.cvomdataadapter.ConsumptionModel": [{}],
        "sap.bi.va.datastructures.HashArray": [{}],
        "sap.bi.va.datastructures.HashSet": [{}],
        "sap.bi.va.firefly": [{}],
        "sap.bi.va.firefly.MetadataCacheService": [{}],
        "sap.bi.va.firefly.MetadataCacheUtils": [{}],
        "sap.bi.va.firefly.QueryModelUtilities": [{}],
        "sap.bi.va.firefly.QueryModelUtilitiesBase": [{}],
        "sap.bi.va.firefly.FireflyUtils": [{}],
        "sap.bi.va.firefly.FireflyDimensionMember": [{}],
        "sap.bi.va.firefly.FireflyUtilsBase": [{}],
        "sap.bi.va.firefly.FireflyBWUtils": [{}],
        "sap.bi.va.firefly.FireflyBWDefaultingUtils": [{}],
        "sap.bi.va.firefly.FireflyConstants": [{}],
        "sap.bi.va.firefly.FireflyDimensionUtility": [{}],
        "sap.bi.va.firefly.HierarchyLevelsQueryUtils": [{}],
        "sap.bi.va.firefly.AugmentedFFQueryManager": [{}],
        "sap.bi.va.firefly.IFireflyResultSet": [{}],
        "sap.bi.va.firefly.PerformanceHintDecorator": [{}],
        "sap.bi.va.firefly.FireflyManager": [{}],
        "sap.bi.va.firefly.ExtendedDimensionJoinType": [{}],
        "sap.bi.va.firefly.ModelMappings": [{}],
        "sap.bi.va.firefly.FireflyVariableUtils": [{}],
        "sap.bi.va.firefly.BackendErrorBase": [{}],
        "sap.bi.va.firefly.BackendError": [{}],
        "sap.bi.va.firefly.BlendingExceptionFirefly": [{}],
        "sap.bi.va.firefly.AbstractionLayerCapabilityManager": [{}],
        "sap.bi.va.formatter.Formatter": [{}],
        "sap.bi.va.formatter.TextFormatter": [{}],
        "sap.bi.va.formatter.TextRenderer": [{}],
        "sap.bi.va.formulaparser.Form": [{}],
        "sap.bi.va.formulaparser.FormulaParser": [{}],
        "sap.bi.va.formulaparser.FormulaHelper": [{}],
        "sap.bi.va.formulaparser.FormulaConstants": [{}],
        "sap.bi.va.formulaparser.ModelEnumDataType": [{}],
        "sap.bi.va.formulaparser.FunctionFamilies": [{}],
        "sap.bi.va.formulaparser.FunctionNames": [{}],
        "sap.bi.va.formulaparser.FunctionObj": [{}],
        "sap.bi.va.formulaparser.Functions": [{}],
        "sap.bi.va.formulaparser.FunctionCodeConstant": [{}],
        "sap.bi.va.formulaparser.CalculationBeforeAggregation": [{}],
        "sap.bi.va.formulaparser.ComplexFormulaValidationDefinitions": [{}],
        "sap.bi.va.formulaparser.StaticBase": [{}],
        "sap.bi.va.formulaparser.FormulaValidation": [{}],
        "sap.bi.va.formulaparser.FormulaMemberUtils": [{}],
        "sap.bi.va.formulaparser.FormulaValidationRegex": [{}],
        "sap.bi.va.formulaparser.FormulaHintConstants": [{}],
        "sap.bi.va.formulaparser.BooleanFunctions": [{}],
        "sap.bi.va.formulaparser.BinaryLogicFunctions": [{}],
        "sap.bi.va.model.query.Answer": [{}],
        "sap.bi.va.model.query.Filter": [{}],
        "sap.bi.va.model.query.SearchAndDisplayType": [{}],
        "sap.bi.va.modelenum.CalculationType": [{}],
        "sap.bi.va.modelenum.Capability": [{}],
        "sap.bi.va.modelenum.EntityType": [{}],
        "sap.bi.va.modelenum.JoinType": [{}],
        "sap.bi.va.modelenum.RecordCalculationType": [{}],
        "sap.bi.va.promptingSupport.ui.PromptDialog": [{}],
        "sap.bi.va.promptingSupport.ui.TreeLOV": [{}],
        "sap.bi.va.promptingSupport.ui.FacetLOV": [{}],
        "sap.bi.va.promptingSupport.ui.ValueInput": [{}],
        "sap.bi.va.queryService.QueryBatcher": [{}],
        "sap.bi.va.queryService.batchedQueryService": [{}],
        "sap.bi.va.queryService.fireflyWrapperService": [{}],
        "sap.bi.va.queryService.fireflyQueryService": [{}],
        "sap.bi.va.queryService.fireflyQueryBaseService": [{}],
        "sap.bi.va.queryService.ErrorUtils": [{}],
        "sap.bi.va.queryService.cachedBatchedQueryService": [{}],
        "sap.bi.va.queryService.consumptionModelConverter": [{}],
        "sap.bi.va.queryService.ConsumptionModel": [{}],
        "sap.bi.va.queryService.PromptQueryServiceWrapper": [{}],
        "sap.bi.va.queryService.AttributeType": [{}],
        "sap.bi.va.queryService.DatasetViewTypeEnum": [{}],
        "sap.bi.va.queryService.FunctionOperatorEnum": [{}],
        "sap.bi.va.queryService.QueryUtils": [{}],
        "sap.bi.va.queryService.FireflyAdaptor": [{}],
        "sap.bi.va.queryService.FilterFireflyQueryGenerator": [{}],
        "sap.bi.va.queryService.ContextQueryWrapper": [{}],
        "sap.bi.va.queryService.CalculationFireflyQueryBuilder": [{}],
        "sap.bi.va.queryService.FireflyWebWorkerQueryService": [{}],
        "sap.bi.va.queryService.FireflyFilterUtils": [{}],
        "sap.bi.va.queryService.FireflyMixinUtils": [{}],
        "sap.bi.va.queryService.BWSmartQueries": [{}],
        "sap.bi.va.queryService.FireflyBWHierarchiesPreloader": [{}],
        "sap.bi.va.queryService.FireflyComplexUnitUtils": [{}],
        "sap.bi.va.queryService.QueryPersistenceDeterminer": [{}],
        "sap.bi.va.queryService.QueryPersistenceDeterminerBase": [{}],
        "sap.bi.va.queryService.PreQueryModelBuilder": [{}],
        "sap.bi.va.queryService.PreQueryUtils": [{}],
        "sap.bi.va.queryService.ResetActionSourceEnum": [{}],
        "sap.bi.va.queryService.LinkedFilterUtils": [{}],
        "sap.bi.va.queryService.FireflyDimensionUtils": [{}],
        "sap.bi.va.queryService.ThresholdUtils": [{}],
        "sap.bi.va.queryService.PreQueryConstants": [{}],
        "sap.bi.va.queryService.QueryServiceConstants": [{}],
        "sap.bi.va.queryService.CalculationPreQueryServiceWrapper": [{}],
        "sap.bi.va.queryService.PreQueriesAssignment": [{}],
        "sap.bi.va.queryService.FireflyBlendingUtils": [{}],
        "sap.bi.va.queryService.FireflyPersistedQueryUtils": [{}],
        "sap.bi.va.queryService.QueryCache": [{}],
        "sap.bi.va.queryService.QueryCacheTypes": [{}],
        "sap.bi.va.queryService.FireflyBatchQueryOptimizer": [{}],
        "sap.bi.va.queryService.CalculatedDimensionQueryBuilder": [{}],
        "sap.bi.va.queryService.FireflyQueryErrorService": [{}],
        "sap.bi.va.queryService.BIQueryConstants": [{}],
        "sap.bi.va.queryService.WebWorkerExecutorQueryService": [{}],
        "sap.bi.va.queryService.WebWorkerUtils": [{}],
        "sap.bi.va.queryService.WebWorkerExternalSync": [{}],
        "sap.bi.va.queryService.StoryModelExternalSync": [{}],
        "sap.bi.va.queryService.FireflyBWVariablesSubmitter": [{}],
        "sap.bi.va.queryService.FireflyBWDynamicVariableUpdateManager": [{}],
        "sap.bi.va.queryService.FireflyBWDynamicVariableUpdateManagerFactory": [{}],
        "sap.bi.va.queryService.LinkOptions": [{}],
        "sap.bi.va.queryService.DatasetLinkUtils": [{}],
        "sap.bi.va.queryService.DatasetLinkUtilsBase": [{}],
        "sap.bi.va.queryService.PersistedQueryUtils": [{}],
        "sap.bi.va.queryService.FireflyExitDynamicVariablesHandler": [{}],
        "sap.bi.va.queryService.BIQueryUtils": [{}],
        "sap.bi.va.queryService.AbstractionLayerCapabilitySupport": [{}],
        "sap.bi.va.queryService.CalculatedDimensionUtils": [{}],
        "sap.bi.va.scroll.ScrollEngine": [{}],
        "sap.bi.va.scroll.Ticker": [{}],
        "sap.bi.va.scroll.GestureRecognizer": [{}],
        "sap.bi.va.scroll.TouchScrollView": [{}],
        "sap.bi.va.scroll.IndicatorBarView": [{}],
        "sap.bi.va.scroll.ScrollView": [{}],
        "sap.bi.va.thirdParty.jspdf": [{}],
        "sap.bi.va.utils.BrowserSupport": [{}],
        "sap.bi.va.utils.Compare": [{}],
        "sap.bi.va.utils.CoreUtilsBase": [{}],
        "sap.bi.va.utils.CoreUtilsBaseRenderDelegate": [{}],
        "sap.bi.va.utils.CoreUtils": [{}],
        "sap.bi.va.utils.XmlToJsonConverter": [{}],
        "sap.bi.va.utils.HashUtils": [{}],
        "sap.bi.va.utils.Tree": [{}],
        "sap.bi.va.utils.ExpandTrees": [{}],
        "sap.bi.va.utils.Constants": [{}],
        "sap.bi.va.utils.EntityType": [{}],
        "sap.bi.va.utils.FetchRequestUtils": [{}],
        "sap.bi.va.utils.StubMaker": [{}],
        "sap.bi.va.utils.ObjectUtils": [{}],
        "sap.bi.va.utils.Cache": [{}],
        "sap.bi.va.utils.WorkerManager": [{}],
        "sap.bi.va.utils.StorageManager": [{}],
        "sap.bi.va.utils.StorageManagerFactory": [{}],
        "sap.bi.va.utils.IndexedDBAdapter": [{}],
        "sap.bi.va.utils.IndexedDBHelper": [{}],
        "sap.bi.va.utils.IndexedDBWorker": [{}],
        "sap.bi.va.utils.EncryptionHelper": [{}],
        "sap.bi.va.utils.KeyStore": [{}],
        "sap.bi.va.utils.TextMetrics": [{}],
        "sap.bi.va.utils.DateFormat": [{}],
        "sap.bi.va.utils.NumberUtils": [{}],
        "sap.bi.va.utils.StringUtils": [{}],
        "sap.bi.va.utils.FormatUtils": [{}],
        "sap.bi.va.utils.Buffer": [{}],
        "sap.bi.va.utils.PerformanceLogger": [{}],
        "sap.bi.va.utils.PerformanceVisualizer": [{}],
        "sap.bi.va.utils.JQueryUIUtils": [{}],
        "sap.bi.va.utils.LoadingAnimation": [{}],
        "sap.bi.va.utils.ColoringUtils": [{}],
        "sap.bi.va.utils.ResourceUtils": [{}],
        "sap.bi.va.utils.GraphAlgorithms": [{}],
        "sap.bi.va.utils.CollectionUtils": [{}],
        "sap.bi.va.utils.HierarchyClusterAlgorithm": [{}],
        "sap.bi.va.utils.NumberFormatScales": [{}],
        "sap.bi.va.utils.ProgressiveRendering": [{}],
        "sap.bi.va.vizutils.FeedHelper": [{}],
        "sap.bi.va.vizutils.ChartTypeInfo": [{}],
        "sap.bi.va.vizutils.ChartCloneHelper": [{}],
        "sap.bi.va.vizutils.ScalesHelper": [{}],
        "sap.bi.va.vizutils.KPIConstants": [{}],
        "sap.bi.va.vizutils.PaletteColors": [{}],
        "sap.bi.va.vizutils.MemberSelectorFactoryFilterHelper": [{}],
        "sap.bi.va.vizutils.NumberScale": [{}],
        "sap.bi.va.vizutils.format.VizDisplayValueFormatter": [{}],
        "sap.bi.va.vizutils.ChartTitleHelper": [{}],
        "sap.bi.va.vizutils.PredictiveClusteringUtils": [{}],
        "sap.bi.va.vizutils.PredictiveVizUtils": [{}],
        "sap.bi.va.vizutils.VarianceUtils": [{}],
        "sap.bi.va.vizutils.HistogramBinPropertiesPanelBuilder": [{}],
        "sap.bi.va.vizutils.ReferenceLineUtils": [{}],
        "sap.bi.va.vizutils.MagnitudeFormatter": [{}],
        "sap.bi.va.vizutils.ErrorBarUtils": [{}],
        "sap.bi.va.vizutils.ForecastUtils": [{}],
        "sap.bi.va.vizutils.ErrorBarConstants": [{}],
        "sap.bi.va.vizutils.TooltipConstants": [{}],
        "sap.bi.va.vizutils.VizDefConverter": [{}],
        "sap.bi.va.vizutils.VizCalculationUtils": [{}],
        "sap.bi.va.vizutils.VizMinimumDrillstateUtils": [{}],
        "sap.bi.va.vizutils.VizMinimumDrillstateTooltipBuilder": [{}],
        "sap.bi.va.vizutils.ChartPromptsHelper": [{}],
        "sap.bi.va.vizutils.font.FontHandler": [{}],
        "sap.bi.va.vizutils.format.DateTimeGranularityFormat": [{}],
        "sap.bi.va.vizutils.VizStyleOverrideUtils": [{}],
        "sap.bi.va.vizutils.ShowLeavesOnlyUtils": [{}],
        "sap.bi.va.vizutils.ThresholdUtils": [{}],
        "sap.bi.va.vizutils.UnbookedDataUtils": [{}],
        "sap.bi.va.vizutils.HistogramUtils": [{}],
        "sap.bi.va.vizutils.NumberFormatUtils": [{}],
        "sap.bi.va.vizutils.IBCSUtils": [{}],
        "sap.bi.va.vizutils.LevelBasedHierarchyUtils": [{}],
        "sap.bi.va.vizutils.DynamicVariances": [{}],
        "sap.bi.va.vizutils.filter.VizFilters": [{}],
        "sap.bi.va.vizutils.VizAutoUpdater": [{}],
        "sap.bi.va.vizutils.migration.VisualizationMigrator": [{}],
        "sap.bi.va.vizutils.translation.VizTranslator": [{}],
        "sap.bi.va.vizutils.ui.VizPanelEvents": [{}],
        "sap.bi.va.widgets.palette.ThemingService": [{}],
        "sap.bi.va.widgets.palette.ThemingServiceFactory": [{}],
        "sap.bi.va.widgets.datePicker.DatePicker": [{}],
        "sap.bi.va.widgets.datePicker.DatePickerRenderer": [{}],
        "sap.bi.va.widgets.datePicker.Calendar": [{}],
        "sap.bi.va.widgets.datePicker.CalendarModeEnum": [{}],
        "sap.bi.va.widgets.datePicker.CalendarUtils": [{}],
        "sap.bi.va.widgets.datePicker.DefaultCalendarConfigurator": [{}],
        "sap.bi.va.widgets.datePicker.FiscalCalendarConfigurator": [{}],
        "sap.bi.va.widgets.datePicker.DefaultDateFormatter": [{}],
        "sap.bi.va.widgets.datePicker.FiscalDateFormatter": [{}],
        "sap.bi.va.widgets.filterPicker.FilterPicker": [{}],
        "sap.bi.va.widgets.filterPicker.FilterPickerMenu": [{}],
        "sap.bi.va.widgets.dimensionPicker.DimensionPicker": [{}],
        "sap.bi.va.widgets.dimensionPicker.DimensionPickerMenu": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.DatePicker": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.Calendar": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.ftd.FTDCalendar": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.ftd.FlexibleCalendarConfigurator": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.CalendarUtils": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.DefaultCalendarConfigurator": [{}],
        "sap.bi.va.widgets.flexibleDatePicker.DefaultDateFormatter": [{}],
        "sap.bi.va.widgets.filterPicker.FilterPickerMenuItem": [{}],
        "sap.bi.va.widgets.dimensionPicker.DimensionPickerMenuItem": [{}],
        "sap.bi.va.widgets.popoverControls.ButtonPopover": [{}],
        "sap.bi.va.widgets.popoverControls.SearchDropdown": [{}],
        "sap.bi.va.widgets.popoverControls.OverlayPopover": [{}],
        "sap.bi.va.widgets.popoverControls.ElementButton": [{}],
        "sap.bi.va.widgets.popoverControls.ElementPopoverContentControl": [{}],
        "sap.bi.va.widgets.popoverControls.ElementTree": [{}],
        "sap.bi.va.widgets.popoverControls.ElementTreeUtils": [{}],
        "sap.bi.va.widgets.textfield.TextField": [{}],
        "sap.bi.va.widgets.textfield.InPlaceEditControl": [{}],
        "sap.bi.va.widgets.palette.UI5PaletteCreationDialogFactory": [{}],
        "sap.bi.va.widgets.palette.ColorChooserControlFactory": [{}],
        "sap.bi.va.widgets.palette.PalettePicker": [{}],
        "sap.bi.va.widgets.palette.GradientCreator": [{}],
        "sap.bi.va.widgets.palette.WaterfallPalettePicker": [{}],
        "sap.bi.va.widgets.palette.PaletteCreationDialog": [{}],
        "sap.bi.va.widgets.palette.ThresholdPalettePicker": [{}],
        "sap.bi.va.widgets.palette.DiscreteNumericMapper": [{}],
        "sap.bi.va.widgets.palette.GradientNumericMapper": [{}],
        "sap.bi.va.widgets.palette.GradientLabelMarker": [{}],
        "sap.bi.va.widgets.palette.GradientDataMapper": [{}],
        "sap.bi.va.widgets.palette.GradientColorMarker": [{}],
        "sap.bi.va.widgets.palette.PaletteGroup": [{}],
        "sap.bi.va.widgets.palette.PaletteItem": [{}],
        "sap.bi.va.widgets.palette.DiscretePaletteMemberViewer": [{}],
        "sap.bi.va.widgets.palette.PaletteType": [{}],
        "sap.bi.va.widgets.palette.PaletteUtils": [{}],
        "sap.bi.va.widgets.palette.PaletteDataMappingUtils": [{}],
        "sap.bi.va.widgets.layout.FlexLayout": [{}],
        "sap.bi.va.widgets.ui5.UI5Wrapper": [{}],
        "sap.bi.va.widgets.ui5.UI5Helper": [{}],
        "sap.bi.va.widgets.loadingIndicator.LoadingIndicator": [{}],
        "sap.bi.va.widgets.utils.Scrollable": [{}],
        "sap.bi.va.widgets.tile.SequentialTileView": [{}],
        "sap.bi.va.widgets.tile.GroupingTileView": [{}],
        "sap.bi.va.widgets.tile.TileFactory": [{}],
        "sap.bi.va.widgets.tile.TileType": [{}],
        "sap.bi.va.widgets.tile.TileViewSelectionMode": [{}],
        "sap.bi.va.widgets.tile.TileSorter": [{}],
        "sap.bi.va.widgets.tile.SimpleTile": [{}],
        "sap.bi.va.widgets.tile.NavTile": [{}],
        "sap.bi.va.widgets.tile.TileSelector": [{}],
        "sap.bi.va.widgets.tree.enhanced.Tree": [{}],
        "sap.bi.va.widgets.tree.enhanced.TreeNode": [{}],
        "sap.bi.va.widgets.tree.enhanced.TreeNodeUtils": [{}],
        "sap.bi.va.widgets.tree.enhanced.TreeModel": [{}],
        "sap.bi.va.widgets.tree.AbstractTreeNode": [{}],
        "sap.bi.va.widgets.tree.sortable.AbstractSortableNode": [{}],
        "sap.bi.va.widgets.tree.sortable.SortableNodeUtils": [{}],
        "sap.bi.va.widgets.tree.sortable.SortableNodeConnection": [{}],
        "sap.bi.va.widgets.tree.sortable.SortableNodeConstants": [{}],
        "sap.bi.va.widgets.tree.sortable.AbstractLeafNode": [{}],
        "sap.bi.va.widgets.panel.PanelHeader": [{}],
        "sap.bi.va.widgets.panel.PanelSubHeader": [{}],
        "sap.bi.va.widgets.panel.PanelLabel": [{}],
        "sap.bi.va.widgets.panel.PanelAddLabel": [{}],
        "sap.bi.va.widgets.panel.PanelButton": [{}],
        "sap.bi.va.widgets.panel.PanelCancelButton": [{}],
        "sap.bi.va.widgets.panel.LitePanelTileItem": [{}],
        "sap.bi.va.widgets.panel.PanelTileItem": [{}],
        "sap.bi.va.widgets.panel.PanelTileItemContainer": [{}],
        "sap.bi.va.widgets.panel.PanelExpandableTileItem": [{}],
        "sap.bi.va.widgets.panel.PanelDataSourceControl": [{}],
        "sap.bi.va.widgets.panel.PanelItemFactory": [{}],
        "sap.bi.va.widgets.panel.PanelItemType": [{}],
        "sap.bi.va.widgets.panel.PanelLabelFactory": [{}],
        "sap.bi.va.widgets.panel.PanelLabelType": [{}],
        "sap.bi.va.widgets.panel.PanelWidgetFactory": [{}],
        "sap.bi.va.widgets.panel.PanelButtonType": [{}],
        "sap.bi.va.widgets.panel.CollapsiblePanel": [{}],
        "sap.bi.va.widgets.panel.PanelContentContainer": [{}],
        "sap.bi.va.widgets.panel.PanelSection": [{}],
        "sap.bi.va.widgets.slider.DateRangeElement": [{}],
        "sap.bi.va.widgets.slider.RangeElement": [{}],
        "sap.bi.va.widgets.slider.Slider": [{}],
        "sap.bi.va.widgets.slider.RangeSlider": [{}],
        "sap.bi.va.widgets.slider.DateRangeSlider": [{}],
        "sap.bi.va.widgets.slider.DateRangeUtils": [{}],
        "sap.bi.va.widgets.slider.RangeSelectorUtils": [{}],
        "sap.bi.va.widgets.slider.NumericRangeSlider": [{}],
        "sap.bi.va.widgets.slider.SliderUtils": [{}],
        "sap.bi.va.widgets.slider.StepCalculator": [{}],
        "sap.bi.va.widgets.Popover": [{}],
        "sap.bi.va.widgets.CustomPopoverArrowPosition": [{}],
        "sap.bi.va.widgets.tree.enhanced.NodeWindower": [{}],
        "sap.bi.va.widgets.icon.EnhancedIcon": [{}],
        "sap.bi.va.widgets.icon.InfoTooltipIcon": [{}],
        "sap.bi.va.widgets.SplitPane": [{}],
        "sap.bi.va.widgets.palette.PaletteWidget": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.AbstractEntityConfigModelFactory": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.AbstractEntityConfigItemFactory": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.MDCEntityConfigModelFactory": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.MDCEntityConfigItemFactory": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.MDCEntityConfigItem": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.EntityConfigItem": [{}],
        "sap.bi.va.widgets.entityConfiguration.EntityConfigConstants": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.EntityConfigModel": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.EntityConfigControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.AbstractEntityConfigControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.AbstractEntityConfigDialog": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.MDCEntityConfigControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.MDCEntityConfigDialog": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.MDCCallout": [{}],
        "sap.bi.va.widgets.entityConfiguration.MDCEntityConfigUtils": [{}],
        "sap.bi.va.widgets.blending.BlendingDialogFactory": [{}],
        "sap.bi.va.widgets.blending.BlendingDialogLoader": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.StaticEntitiesPreviewControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.AvailableEntitiesSelectionControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.AvailableEntitiesSelectionControlAllMember": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.SelectedEntitiesPreviewControl": [{}],
        "sap.bi.va.widgets.entityConfiguration.controls.SelectedEntitiesPreviewControlItem": [{}],
        "sap.bi.va.widgets.entityConfiguration.model.TreeModelCreator": [{}],
        "sap.bi.va.widgets.relativeDateRangePicker.RelativeDateRangePicker": [{}],
        "sap.bi.va.widgets.relativeDateRangePicker.RelativeDateRangePickerUtils": [{}],
        "sap.bi.va.widgets.MessageStrip": [{}],
        "sap.bi.va.widgets.DataSourceMessageStrip": [{}],
        "sap.bi.va.widgets.AliasMessageStrip": [{}],
        "sap.bi.va.widgets.CssWarningMessageStrip": [{}],
        "sap.bi.va.widgets.OptimizedTableMessageStrip": [{}],
        "sap.bi.va.widgets.timestampPicker.TimestampPicker": [{}],
        "sap.bi.va.widgets.timestampPicker.TimestampRangePicker": [{}],
        "sap.epm.story.Story": [{}],
        "sap.epm.story.StoryRemoteUtils": [{}],
        "sap.epm.story.UQMChartScalingUtils": [{}],
        "sap.fpa.story.documentStore.Store": [{}],
        "sap.fpa.story.documentStore.DocumentModel": [{}],
        "sap.fpa.story.documentStore.DocumentActions": [{}],
        "sap.fpa.story.documentStore.DocumentSelectors": [{}],
        "sap.fpa.story.documentStore.ExplorerActions": [{}],
        "sap.fpa.story.documentStore.ExplorerSelectors": [{}],
        "sap.fpa.story.documentStore.WranglingActions": [{}],
        "sap.fpa.story.documentStore.WranglingSelectors": [{}],
        "sap.fpa.story.documentStore.PreviewPaneActions": [{}],
        "sap.fpa.story.documentStore.PreviewPaneSelectors": [{}],
        "sap.fpa.story.documentStore.FilterBarActions": [{}],
        "sap.fpa.story.documentStore.FilterBarSelectors": [{}],
        "sap.fpa.story.documentStore.FormulaBarActions": [{}],
        "sap.fpa.story.documentStore.CalendarToolbarActions": [{}],
        "sap.fpa.story.documentStore.FormulaBarSelectors": [{}],
        "sap.fpa.story.documentStore.CalendarToolbarSelectors": [{}],
        "sap.fpa.story.documentStore.StoryActions": [{}],
        "sap.fpa.story.documentStore.StorySelectors": [{}],
        "sap.fpa.story.documentStore.CommentingActions": [{}],
        "sap.fpa.story.documentStore.CommentingSelectors": [{}],
        "sap.fpa.story.documentStore.ExaminePaneActions": [{}],
        "sap.fpa.story.documentStore.ExaminePaneSelectors": [{}],
        "sap.fpa.story.documentStore.PageActions": [{}],
        "sap.fpa.story.documentStore.PageSelectors": [{}],
        "sap.fpa.story.documentStore.DesignerPanelActions": [{}],
        "sap.fpa.story.documentStore.DesignerPanelSelectors": [{}],
        "sap.fpa.story.documentStore.LinkedAnalysisAssistantActions": [{}],
        "sap.fpa.story.documentStore.LinkedAnalysisAssistantSelectors": [{}],
        "sap.fpa.story.documentStore.OverlayPanelActions": [{}],
        "sap.fpa.story.documentStore.OverlayPanelSelectors": [{}],
        "sap.fpa.story.documentStore.SidePanelModel": [{}],
        "sap.fpa.story.documentStore.WidgetActions": [{}],
        "sap.fpa.story.documentStore.WidgetSelectors": [{}],
        "sap.fpa.story.documentStore.ToolbarModel": [{}],
        "sap.fpa.story.documentStore.ToolbarActions": [{}],
        "sap.fpa.story.documentStore.ToolbarSelectors": [{}],
        "sap.fpa.story.documentStore.DataAnalyzerActions": [{}],
        "sap.fpa.story.documentStore.DataAnalyzerSelectors": [{}],
        "sap.fpa.story.documentStore.PresentModeToolbarActions": [{}],
        "sap.fpa.story.documentStore.PresentModeToolbarSelectors": [{}],
        "sap.fpa.story.documentStore.VideoGenerationActions": [{}],
        "sap.fpa.story.documentStore.VideoGenerationSelectors": [{}],
        "sap.fpa.story.documentStore.VideoDataStoryActions": [{}],
        "sap.fpa.story.documentStore.VideoDataStorySelectors": [{}],
        "sap.fpa.bi.achievement.AchievementEvents": [{}],
        "sap.fpa.bi.achievement.AchievementManager": [{}],
        "sap.fpa.bi.achievement.Achievements": [{}],
        "sap.fpa.bi.appStore.Store": [{}],
        "sap.fpa.bi.appStore.AppSelectors": [{}],
        "sap.fpa.bi.appStore.AppActions": [{}],
        "sap.fpa.bi.appStore.ShellActions": [{}],
        "sap.fpa.bi.appStore.ShellSelectors": [{}],
        "sap.fpa.bi.appStore.ShellModel": [{}],
        "sap.fpa.bi.appStore.IntegrationActions": [{}],
        "sap.fpa.bi.appStore.IntegrationSelectors": [{}],
        "sap.fpa.bi.appStore.HelpCenterPopupActions": [{}],
        "sap.fpa.bi.appStore.HelpCenterPopupSelectors": [{}],
        "sap.fpa.bi.bookmark.BookmarkService": [{}],
        "sap.fpa.bi.bookmark.BookmarkServiceWrapper": [{}],
        "sap.fpa.bi.bookmark.controls.GlobalBookmarkDropDown": [{}],
        "sap.fpa.bi.bookmark.controls.BookmarkButton": [{}],
        "sap.fpa.bi.bookmark.controls.EmbedBookmarkButton": [{}],
        "sap.fpa.bi.bookmark.utils.BookmarkUIHelper": [{}],
        "sap.fpa.bi.bookmark.framework.BookmarkConstants": [{}],
        "sap.fpa.bi.bookmark.framework.BookmarkServiceProvider": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.LinkedAnalysisBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.LinkedAnalysisBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.CalculationsBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.FiltersBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.ChartBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ChartBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ChartBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMChartBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMDataActionTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMFieldSelectionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMFilterlineBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMGeoBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMImageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMMultiActionsTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMPageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMLAPageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMLAPageGroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMPlanningFlowBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMRBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMTableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ButtonBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CheckboxgroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RadiobuttongroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CalculationVariableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GlobalVariableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GlobalDSPromptBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMGlobalDSPromptBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CalculationBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PanelBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CommentBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.FlowPanelBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.LaneBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.StoryFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ThemeBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.LayoutsBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ResponsiveContainerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportCsvBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportPdfBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportXlsxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.BusyIndicatorBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DatasetAliasBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DatasetBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TabstripBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageBookBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageDefinitionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.BPCBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DataActionTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.MultiActionsTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.FilterlineBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GeoBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ImageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.InputfieldBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TextareaBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RangesliderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RssreaderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ShapeBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ClockBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.SliderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TextBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.WebpageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.GeoBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.RWidgetBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.StoryBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.TableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DropdownBoxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.FieldSelectionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.controls.SuggestedDefaultBookmarkDialog": [{}],
        "sap.fpa.bi.bookmark.controls.UnsupportedOptimizedBookmarkDialog": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ListBoxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PlanningFlowBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.SwitchBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.utils.GeoBookmarkFilterUtils": [{}],
        "sap.fpa.bi.bookmark.utils.BookmarkPromptUtils": [{}],
        "sap.fpa.bi.bookmark.utils.BookmarkAgentUtils": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.BookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.GeoBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.StoryFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.PageFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.LinkedAnalysisFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.StoryPromptBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.ChartBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.TableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DropdownBoxBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.FieldSelectionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ButtonBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CheckboxgroupBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CalculationVariableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GlobalVariableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GlobalDSPromptBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportCsvBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportPdfBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ExportXlsxBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CalculationBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PanelBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CommentBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.LinkedAnalysisBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TabstripBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageBookBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageDefinitionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DatasetAliasBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DatasetBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.StoryFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ThemeBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.LayoutsBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.DataActionTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.MultiActionsTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.BPCBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.FilterlineBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.GeoBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ImageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.InputfieldBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TextareaBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RangesliderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RssreaderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ShapeBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.SliderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.SwitchBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.BusyIndicatorBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.TextBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.WebpageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.RadiobuttongroupBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.ChartBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMChartBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMDataActionTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMFieldSelectionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMFilterlineBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMGeoBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMImageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMMultiActionsTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMPageFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMRBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMTableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMPlanningFlowBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.UQMGlobalDSPromptBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.CalculationInputControlBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.FieldSelectionInputControlBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.GeoDistanceInputControlBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.RWidgetBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.bookmarkagents.CalculatedInputControlBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PlanningFlowBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.appbookmarkagents.PageFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.framework.Bookmark": [{}],
        "sap.fpa.bi.bookmark.controls.BookmarkDialog": [{}],
        "sap.fpa.bi.bookmark.controls.BookmarkMenu": [{}],
        "sap.fpa.bi.bookmark.utils.BookmarkMenuItemsUtils": [{}],
        "sap.fpa.bi.bookmark.controls.BookmarkTypes": [{}],
        "sap.fpa.bi.bookmark.controls.BookmarkMigrationProgressIndicator": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMChartBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMDataActionTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMFieldSelectionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMFilterlineBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMGeoBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMImageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMMultiActionsTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMPageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMLAPageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMLAPageGroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMFieldSelectionInputControlWidgetBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMPlanningFlowBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMRBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMStoryFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMTableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ButtonBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CheckboxgroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RadiobuttongroupBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationVariableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GlobalVariableBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GlobalDSPromptBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMGlobalDSPromptBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PanelBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CommentBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.FlowPanelBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.LaneBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.StoryFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ThemeBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.LayoutsBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ResponsiveContainerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportCsvBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportPdfBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportXlsxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.BusyIndicatorBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DatasetAliasBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DatasetBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TabstripBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageBookBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageDefinitionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.BPCBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DataActionTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.MultiActionsTriggerBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.FilterlineBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GeoBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ImageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.InputfieldBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TextareaBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RangesliderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RssreaderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ShapeBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ClockBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.SliderBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TextBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.WebpageBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DropdownBoxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.FieldSelectionBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ListBoxBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PlanningFlowBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.SwitchBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CustomCurrentDateBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.HyperlinkFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.StoryLAFilterBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CompositeBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.utils.BookmarkAgentUtils": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationInputControlBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DropdownBoxBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.FieldSelectionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ButtonBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CheckboxgroupBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationVariableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GlobalVariableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GlobalDSPromptBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportCsvBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportPdfBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ExportXlsxBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PanelBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CommentBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.LinkedAnalysisBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TabstripBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageBookBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageDefinitionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DatasetAliasBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DatasetBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.StoryFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ThemeBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.LayoutsBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.DataActionTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.MultiActionsTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.BPCBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.FilterlineBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.GeoBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ImageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.InputfieldBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TextareaBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RangesliderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RssreaderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ShapeBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.SliderBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.SwitchBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.BusyIndicatorBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.TextBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.WebpageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.RadiobuttongroupBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.ChartBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMChartBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMDataActionTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMFieldSelectionBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMFilterlineBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMGeoBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMImageBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMMultiActionsTriggerBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMPageFilterBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMRBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMTableBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMPlanningFlowBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.UQMGlobalDSPromptBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.CalculationInputControlBookmarkAgentFactory": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PlanningFlowBookmarkAgent": [{}],
        "sap.fpa.bi.bookmark.story2bookmarkagents.PageFilterBookmarkAgent": [{}],
        "sap.fpa.bi.browserCache.PresentationCacheHelper": [{}],
        "sap.fpa.bi.browserCache.CryptoKeyManager": [{}],
        "sap.fpa.bi.browserCache.CacheStorage": [{}],
        "sap.fpa.bi.browserCache.ServiceWorkerManagerFactory": [{}],
        "sap.fpa.bi.browserCache.ResourceType": [{}],
        "sap.fpa.bi.browserCache.KeyFetcher": [{}],
        "sap.fpa.bi.browserCache.ResponseCachesManager": [{}],
        "sap.fpa.bi.browserCache.ResponseCacheConstants": [{}],
        "sap.fpa.bi.browserCache.CacheSanitizer": [{}],
        "sap.fpa.bi.browserCache.RequestsFilterService": [{}],
        "sap.fpa.bi.browserCache.BrowserCacheRequestService": [{}],
        "sap.fpa.bi.browserCache.story.StoryCacheService": [{}],
        "sap.fpa.bi.browserCache.model.ModelCacheService": [{}],
        "sap.fpa.bi.browserCache.presentation.PresentationCacheService": [{}],
        "sap.fpa.bi.browserCache.CacheServiceUtils": [{}],
        "sap.fpa.bi.browserCache.QueryDefinitionUtils": [{}],
        "sap.fpa.bi.browserCache.BrowserCacheHelper": [{}],
        "sap.fpa.bi.calculationService.MessageHelper": [{}],
        "sap.fpa.bi.calculationService.CalculationService": [{}],
        "sap.fpa.bi.calculationService.CalculationsManager": [{}],
        "sap.fpa.bi.calculationService.TablePreQueryUtils": [{}],
        "sap.fpa.bi.calculationService.CalculationDependencyManager": [{}],
        "sap.fpa.bi.calculationService.CalculationVariableService": [{}],
        "sap.fpa.bi.calculationService.RestrictedMeasure": [{}],
        "sap.fpa.bi.calculationService.VarianceCalculation": [{}],
        "sap.fpa.bi.calculationService.WidgetConstantsBase": [{}],
        "sap.fpa.bi.calculationService.WidgetConstants": [{}],
        "sap.fpa.bi.calculationService.TimeDifferenceFromCalculation": [{}],
        "sap.fpa.bi.calculationService.DateDifferenceCalculation": [{}],
        "sap.fpa.bi.calculationService.DimensionToMeasureCalculation": [{}],
        "sap.fpa.bi.calculationService.DimensionDifferenceFromCalculation": [{}],
        "sap.fpa.bi.calculationService.OutOfContextCalculation": [{}],
        "sap.fpa.bi.calculationService.Calculation": [{}],
        "sap.fpa.bi.calculationService.Conversion": [{}],
        "sap.fpa.bi.calculationService.RunningTotalDlg": [{}],
        "sap.fpa.bi.calculationService.CalculationFactory": [{}],
        "sap.fpa.bi.calculationService.CalculationQueryBuilder": [{}],
        "sap.fpa.bi.calculationService.CalculationUtility": [{}],
        "sap.fpa.bi.calculationService.CrossCalculationVizDef": [{}],
        "sap.fpa.bi.calculationService.TimeDifferenceType": [{}],
        "sap.fpa.bi.calculationService.VarianceConstants": [{}],
        "sap.fpa.bi.calculationService.MemberNavigationConstants": [{}],
        "sap.fpa.bi.calculationService.AggregationTypeConstants": [{}],
        "sap.fpa.bi.calculationService.CalculationVariableConstants": [{}],
        "sap.fpa.bi.calculationService.RunningTotalTypeConstants": [{}],
        "sap.fpa.bi.calculationService.MemberSelectFormulaConstants": [{}],
        "sap.fpa.bi.calculationService.CalculationEditorConstants": [{}],
        "sap.fpa.bi.calculationService.FormattingConstants": [{}],
        "sap.fpa.bi.calculationService.ForecastConstants": [{}],
        "sap.fpa.bi.calculationService.CalculationEditorUtility": [{}],
        "sap.fpa.bi.calculationService.CalculationInputControl": [{}],
        "sap.fpa.bi.calculationService.CalculationVersion": [{}],
        "sap.fpa.bi.calculationService.UQMCalculationVersion": [{}],
        "sap.fpa.bi.calculationService.UQMCalculationsLoadOrderVersion": [{}],
        "sap.fpa.bi.calculationService.AggregationDlg": [{}],
        "sap.fpa.bi.calculationService.CalculationDialog": [{}],
        "sap.fpa.bi.calculationService.ConversionMeasure": [{}],
        "sap.fpa.bi.calculationService.DateDifferenceDlg": [{}],
        "sap.fpa.bi.calculationService.DifferenceFromDlg": [{}],
        "sap.fpa.bi.calculationService.DimensionToMeasureDlg": [{}],
        "sap.fpa.bi.calculationService.Forecast": [{}],
        "sap.fpa.bi.calculationService.MeasureGroupingCalculatedDimensionDlg": [{}],
        "sap.fpa.bi.calculationService.MemberFunction": [{}],
        "sap.fpa.bi.calculationService.CalculationNumberFormattingDialog": [{}],
        "sap.fpa.bi.calculationService.dialog.RestrictedMeasure": [{}],
        "sap.fpa.bi.calculationService.RollingForecast": [{}],
        "sap.fpa.bi.calculationService.MemberNavigationASTBuilder": [{}],
        "sap.fpa.bi.calculationService.RestrictedMeasureDynamicTimeOption": [{}],
        "sap.fpa.bi.calculationService.CalculationFormulaUtils": [{}],
        "sap.fpa.bi.calculationService.CalculationUtils": [{}],
        "sap.fpa.bi.calculationService.EntitySetUtils": [{}],
        "sap.fpa.bi.calculationService.ForecastUtils": [{}],
        "sap.fpa.bi.calculationService.CalculationConverter": [{}],
        "sap.fpa.bi.calculationService.CalculationVariableConverter": [{}],
        "sap.fpa.bi.calculationService.NestingValidationResult": [{}],
        "sap.fpa.bi.calculationService.InvalidNestingTypes": [{}],
        "sap.fpa.bi.calculationService.NestingValidationMessageMapper": [{}],
        "sap.fpa.bi.calculationService.CalculationVariableFormulaProcessor": [{}],
        "sap.fpa.bi.calculationService.AbstractCompositeCalculation": [{}],
        "sap.fpa.bi.calculationService.CalculationRemoteFeatureSupport": [{}],
        "sap.fpa.bi.calculationService.Group": [{}],
        "sap.fpa.bi.calculationService.MeasureGroupingCalculatedDimensionUtils": [{}],
        "sap.fpa.bi.calculationService.FormulaASTBuilder": [{}],
        "sap.fpa.bi.calculationService.HistogramMeasureGroupingCalculatedDimension": [{}],
        "sap.fpa.bi.calculationService.VirtualMemberInStory": [{}],
        "sap.fpa.bi.calculationService.HistogramOutOfContextCalculation": [{}],
        "sap.fpa.bi.calculationService.MeasureGroupingCalculatedDimension": [{}],
        "sap.fpa.bi.calculationService.FormulaExceptions": [{}],
        "sap.fpa.bi.calculationService.MemberFormulaProcessor": [{}],
        "sap.fpa.bi.calculationService.ui.CalculationUIUtilities": [{}],
        "sap.fpa.bi.calculationService.ui.CalculationFormattingUtilities": [{}],
        "sap.fpa.bi.calculationService.CalculationDialogHelper": [{}],
        "sap.fpa.bi.calculationService.UQMCalculationServiceUtils": [{}],
        "sap.fpa.bi.calculationService.CalculationServiceFactory": [{}],
        "sap.fpa.bi.calculationService.CalculationVariableServiceFactory": [{}],
        "sap.fpa.bi.calculationService._MeasureBasedFilterCalculatedDimension": [{}],
        "sap.fpa.bi.calculationService.planSeq.PlanSeqTriggerWidgetCalculations": [{}],
        "sap.fpa.bi.calculationService.multiActions.MultiActionsTriggerWidgetCalculations": [{}],
        "sap.fpa.bi.calculationService.constant.Constants": [{}],
        "sap.fpa.bi.calculationService.TimeMDHandler": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringManagerFactory": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringSupportedFactory": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringConstants": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringMap": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringForwardConverter": [{}],
        "sap.fpa.bi.chartColoring.ChartRangeColoringForwardConverter": [{}],
        "sap.fpa.bi.chartColoring.ChartColoringControlsLoader": [{}],
        "sap.fpa.bi.chartRangeSyncing.ChartRangeSyncingManager": [{}],
        "sap.fpa.bi.chartRangeSyncing.ChartRangeSyncingManagerFactory": [{}],
        "sap.fpa.bi.chartScaling.ChartScalingUtils": [{}],
        "sap.fpa.bi.chartScaling.ChartScalingManager": [{}],
        "sap.fpa.bi.chartScaling.ChartScalingManagerFactory": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasureButton": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasureSetList": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasurePopoverContentControl": [{}],
        "sap.fpa.bi.chartScaling.processors.ChartExtremeProcessor": [{}],
        "sap.fpa.bi.chartScaling.processors.ChartScalingDensityProcessor": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasureList": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasureTree": [{}],
        "sap.fpa.bi.chartScaling.control.ScaledMeasureSetListItem": [{}],
        "sap.fpa.bi.collaboration.CommentControl": [{}],
        "sap.fpa.bi.collaboration.CommentEditControl": [{}],
        "sap.fpa.bi.collaboration.ManageCommentsDialog": [{}],
        "sap.fpa.bi.collaboration.CommentController": [{}],
        "sap.fpa.bi.collaboration.CommentListControl": [{}],
        "sap.fpa.bi.collaboration.CommentModalControl": [{}],
        "sap.fpa.bi.collaboration.CommentDataProvider": [{}],
        "sap.fpa.bi.collaboration.CommentMockService": [{}],
        "sap.fpa.bi.collaboration.CommentingPanel": [{}],
        "sap.fpa.bi.collaboration.CommentDelegate": [{}],
        "sap.fpa.bi.collaboration.mockCommentIndicatorControl": [{}],
        "sap.fpa.bi.collaboration.CommentIndicatorControl": [{}],
        "sap.fpa.bi.collaboration.CommentHollowIndicatorControl": [{}],
        "sap.fpa.bi.collaboration.CommentWedgeIndicatorControl": [{}],
        "sap.fpa.bi.collaboration.CommentTableCellHighlightControl": [{}],
        "sap.fpa.bi.collaboration.CommentIndicatorContainerControl": [{}],
        "sap.fpa.bi.collaboration.CommentUtils": [{}],
        "sap.fpa.bi.collaboration.MentionUserControl": [{}],
        "sap.fpa.bi.collaboration.MentionUserList": [{}],
        "sap.fpa.bi.collaboration.MentionUserRichTextControl": [{}],
        "sap.fpa.bi.collaboration.CommentDatapointFactory": [{}],
        "sap.fpa.bi.collaboration.CellToDatapointComparator": [{}],
        "sap.fpa.bi.collaboration.CellToDataPointComparatorV2": [{}],
        "sap.fpa.bi.collaboration.CommentOverlay": [{}],
        "sap.fpa.bi.collaboration.CommentEnums": [{}],
        "sap.fpa.bi.collaboration.UserController": [{}],
        "sap.fpa.bi.commenting.CommentHollowIndicatorBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentIndicatorBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentIndicatorGroupBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentIndicatorContainer": [{}],
        "sap.fpa.bi.commenting.CommentItemEditControl": [{}],
        "sap.fpa.bi.commenting.CommentModalBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentPanelBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentWidgetBaseContainer": [{}],
        "sap.fpa.bi.commenting.CommentWidgetItemBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentItemBaseControl": [{}],
        "sap.fpa.bi.commenting.CommentRichTextEditor": [{}],
        "sap.fpa.bi.commenting.MentionUserControl": [{}],
        "sap.fpa.bi.commenting.MentionUserList": [{}],
        "sap.fpa.bi.commenting.MentionUserItem": [{}],
        "sap.fpa.bi.commenting.CommentAPI": [{}],
        "sap.fpa.bi.commenting.CommentConfig": [{}],
        "sap.fpa.bi.commenting.CommentManager": [{}],
        "sap.fpa.bi.commenting.CommentActionCreator": [{}],
        "sap.fpa.bi.commenting.CommentResponseActionCreator": [{}],
        "sap.fpa.bi.commenting.CommentSelector": [{}],
        "sap.fpa.bi.commenting.CommentIndicatorSelector": [{}],
        "sap.fpa.bi.commenting.CommentModalSelector": [{}],
        "sap.fpa.bi.commenting.CommentPanelSelector": [{}],
        "sap.fpa.bi.commenting.CommentRequestManager": [{}],
        "sap.fpa.bi.commenting.CommentUtils": [{}],
        "sap.fpa.bi.commenting.CommentEnums": [{}],
        "sap.fpa.bi.commenting.CommentStore": [{}],
        "sap.fpa.bi.commenting.PluginRegistry": [{}],
        "sap.fpa.bi.commenting.CommentMixin": [{}],
        "sap.fpa.bi.commenting.CommentControlFactory": [{}],
        "sap.fpa.bi.commenting.MessageHelper": [{}],
        "sap.fpa.bi.commenting.CommentCryptoRequestManager": [{}],
        "sap.fpa.bi.commenting.BWCommentUtil": [{}],
        "sap.fpa.bi.commenting.CommentWidgetContainerBW": [{}],
        "sap.fpa.bi.commenting.CommentWidgetModalControlBW": [{}],
        "sap.fpa.bi.commenting.CommentWidgetCommentItemControlBW": [{}],
        "sap.fpa.bi.commenting.CommentWidgetCommentItemEditControlBW": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTablePlugin": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTablePluginUQM": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentApiForAppBuilding": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentRender": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentRenderUQM": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableContextProvider": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableContextProviderUQM": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableStausProvider": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableStausProviderUQM": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentWedgeIndicatorGroupControl": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableControl": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentItemTableControl": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentAIContentManager": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentAIContentHandler": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableUtils": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableEnums": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableModalControl": [{}],
        "sap.fpa.ui.pa.reportEngine.CellToDataPointComparatorV2": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentDatapointFactory": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentSupportHandler": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentOverlay": [{}],
        "sap.fpa.ui.pa.reportEngine.ContextGenerator": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentDimensionSupportUtils": [{}],
        "sap.fpa.ui.pa.reportEngine.MessageHelper": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentColumnContainer": [{}],
        "sap.fpa.ui.pa.reportEngine.DataCellCommentContainer": [{}],
        "sap.fpa.ui.pa.reportEngine.DataCellCommentContainerBW": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentColumnContainerBW": [{}],
        "sap.fpa.ui.pa.reportEngine.CommentTableModalControlBW": [{}],
        "sap.fpa.bi.complexFilter.ComplexFilterDialogFactory": [{}],
        "sap.fpa.bi.complexFilter.ComplexFilterTreeModel": [{}],
        "sap.fpa.bi.complexFilter.Constants": [{}],
        "sap.fpa.bi.complexFilter.Events": [{}],
        "sap.fpa.bi.complexFilter.helpers.ComplexFilterDialogDataProvider": [{}],
        "sap.fpa.bi.complexFilter.MessageHelper": [{}],
        "sap.fpa.bi.keyboardShortcuts.KeyboardShortcutsService": [{}],
        "sap.fpa.bi.keyboardShortcuts.Shortcut": [{}],
        "sap.fpa.bi.keyboardShortcuts.KeyEvent": [{}],
        "sap.fpa.bi.keyboardShortcuts.KeyCode": [{}],
        "sap.fpa.bi.keyboardShortcuts.ShortcutTooltip": [{}],
        "sap.fpa.bi.copypaste.CopyPasteService": [{}],
        "sap.fpa.bi.copypaste.CopyPasteProvider": [{}],
        "sap.fpa.bi.copypaste.AbstractCopyPasteProvider": [{}],
        "sap.fpa.bi.dynamicText.DynamicTextConstants": [{}],
        "sap.fpa.bi.dynamicText._DynamicTextFilterUtils": [{}],
        "sap.fpa.bi.dynamicText._DynamicTextVariableUtils": [{}],
        "sap.fpa.bi.dimensionMemberOrder.DimensionMemberOrderManagerFactory": [{}],
        "sap.fpa.bi.dimensionMemberOrder.DimensionMemberOrderManager": [{}],
        "sap.fpa.bi.dimensionMemberOrder.DimensionMemberOrderUtils": [{}],
        "sap.fpa.bi.dimensionMemberOrder.DimensionMemberOrderEvents": [{}],
        "sap.fpa.bi.dimensionMemberOrder.control.EditMemberOrderPanel": [{}],
        "sap.fpa.bi.dimensionMemberOrder.control._DimensionMemberTreeListModel": [{}],
        "sap.fpa.bi.dimensionMemberOrder._DimensionMemberOrderConstants": [{}],
        "sap.fpa.bi.dimensionMemberOrder._DimensionMemberOrderManager": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerContainer": [{}],
        "sap.fpa.bi.explorerContainer.DialogExplorerContainer": [{}],
        "sap.fpa.bi.explorerContainer.widgets.AbstractExplorerWidget": [{}],
        "sap.fpa.bi.explorerContainer.widgets.ExplorerWidgetFactory": [{}],
        "sap.fpa.bi.explorerContainer.widgets.ExplorerChartWidget": [{}],
        "sap.fpa.bi.explorerContainer.widgets.ExplorerDTCWidget": [{}],
        "sap.fpa.bi.explorerContainer.widgets.ExplorerWidgetTypes": [{}],
        "sap.fpa.bi.explorerContainer.widgets.ExplorerWidgetChangedTypes": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerContextConstants": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerService": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerUtils": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerViewsManager": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerConfig": [{}],
        "sap.fpa.bi.explorerContainer.ExplorerStoreEntityManager": [{}],
        "_sap.fpa.bi.explorerContainer.ShowHideDimensionMenu": [{}],
        "sap.fpa.bi.facetExploreMode.messageHelper": [{}],
        "sap.fpa.bi.facetExploreMode.FacetExplorePane": [{}],
        "sap.fpa.bi.facetExploreMode.FacetUtils": [{}],
        "sap.fpa.bi.facetExploreMode.FacetExploreDataProvider": [{}],
        "sap.fpa.bi.facetExploreMode.ExplorerDisplayOptionsUtils": [{}],
        "sap.fpa.bi.facetExploreMode._ExplorerMeasureUtils": [{}],
        "sap.fpa.bi.facetExploreMode.FacetMenuBaseActions": [{}],
        "sap.fpa.bi.facetExploreMode.FacetFilterHierarchy": [{}],
        "sap.fpa.bi.facetExploreMode.AccountsDialog": [{}],
        "sap.fpa.bi.facetExploreMode.FacetReorderDialog": [{}],
        "sap.fpa.bi.chartFeeds.messageHelper": [{}],
        "sap.fpa.bi.chartFeeds.FeedConstants": [{}],
        "sap.fpa.bi.chartFeeds.ChartFeeds": [{}],
        "sap.fpa.bi.chartFeeds.Bindings": [{}],
        "sap.fpa.bi.chartFeeds.constants.BindingErrors": [{}],
        "sap.fpa.bi.chartFeeds.BindingValidator": [{}],
        "sap.fpa.bi.chartFeeds.BindingException": [{}],
        "sap.fpa.bi.fieldSelectionService.MessageHelper": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionService": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionModel": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionFactory": [{}],
        "sap.fpa.bi.fieldSelectionService.controls.FieldSelectionConfigControl": [{}],
        "sap.fpa.bi.fieldSelectionService.controls.FieldSelectionConfigDialog": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionUtils": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionConverter": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionError": [{}],
        "sap.fpa.bi.fieldSelectionService.FieldSelectionAnswerUtils": [{}],
        "sap.fpa.bi.fieldSelectionService.model.DimensionSelection_TestOnly": [{}],
        "sap.fpa.bi.filter.FilterUtils": [{}],
        "sap.fpa.bi.filter.FilterMemberSelectorUtils": [{}],
        "sap.fpa.bi.filter.WildcardFilterUtils": [{}],
        "sap.fpa.bi.filter.FilterCapabilities": [{}],
        "sap.fpa.bi.filter.FilterContextConstants": [{}],
        "sap.fpa.bi.filter.WidgetConstantsForFilters": [{}],
        "sap.fpa.bi.filter.FilterMergeUtils": [{}],
        "sap.fpa.bi.filter.FilterPipelineUtils": [{}],
        "sap.fpa.bi.filter.utils.public.FilterLineGroupUtils": [{}],
        "sap.fpa.bi.filter.EffectiveFilterUtils": [{}],
        "sap.fpa.bi.filter.RangeFilterUtils": [{}],
        "sap.fpa.bi.filter.UQMFilterConversionUtils": [{}],
        "sap.fpa.bi.filter.FilterConfiguratorManager": [{}],
        "sap.fpa.bi.filter.FilterConfiguratorInterface": [{}],
        "sap.fpa.bi.filter.FilterService": [{}],
        "sap.fpa.bi.filter.FilterLOVService": [{}],
        "sap.fpa.bi.filter.FilterLOVContext": [{}],
        "sap.fpa.bi.filter.services.FilterCascadeService": [{}],
        "sap.fpa.bi.filter.services.lookup.FilterLookupService": [{}],
        "sap.fpa.bi.filter.FilterUsageTracking": [{}],
        "sap.fpa.bi.filter.RelativeDateRangeInfo": [{}],
        "sap.fpa.bi.filter.FilterForwardConverter": [{}],
        "sap.fpa.bi.filter.models.ICObjectFactory": [{}],
        "sap.fpa.bi.filter.models.ICObject": [{}],
        "sap.fpa.bi.filter.models.ICConstants": [{}],
        "sap.fpa.bi.filter.models.ICLocationCapabilities": [{}],
        "sap.fpa.bi.filter.models.ICConstantsHelper": [{}],
        "sap.fpa.bi.filter.models.ICObjectImpl": [{}],
        "sap.fpa.bi.filter.models.ICObjectExtension": [{}],
        "sap.fpa.bi.filter.utils.public.BookmarkFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.CascadeUtils": [{}],
        "sap.fpa.bi.filter.utils.public.FilterClassificationUtils": [{}],
        "sap.fpa.bi.filter.utils.public.FilterWrapperUtils": [{}],
        "sap.fpa.bi.filter.utils.public.ranges.QuickTimeFilterRangeUtils": [{}],
        "sap.fpa.bi.filter.controls.ICToken": [{}],
        "sap.fpa.bi.filter.controls.ICTokenPopup": [{}],
        "sap.fpa.bi.filter.controls.OptimizeWidgetFilterNotificationToastUIHelper": [{}],
        "sap.fpa.bi.filter.controls.OptimizeWidgetTimeRangeFilterInfoDialog": [{}],
        "sap.fpa.bi.filter.controls.UQMFilterControlsLoader": [{}],
        "sap.fpa.bi.filter.controls.controllers.AbstractICController": [{}],
        "sap.fpa.bi.filter.controls.controllers.CCDICController": [{}],
        "sap.fpa.bi.filter.controls.controllers.PromptICController": [{}],
        "sap.fpa.bi.filter.controls.EmbeddedMenu": [{}],
        "sap.fpa.bi.filter.controls.ICReconciler": [{}],
        "sap.fpa.bi.filter.controls.popupContent.CustomCurrentDatePopupContent": [{}],
        "sap.fpa.bi.filter.controls.popupContent.PromptPopupContent": [{}],
        "sap.fpa.bi.filter.controls.popupContent.FilterTokenToolTipContent": [{}],
        "sap.fpa.bi.filter.controls.factories.ICTokenControlSetFactory": [{}],
        "sap.fpa.bi.filter.controls.factories.BindingObject": [{}],
        "sap.fpa.bi.filter.controls.misc.FilterItemHelper": [{}],
        "sap.fpa.bi.filter.controls.misc.FilterTokenHelper": [{}],
        "sap.fpa.bi.filter.controls.misc.FilterPauseUtils": [{}],
        "sap.fpa.bi.filter.utils.public.GeoFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.ComplexFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.ComplexFilterQueryNodeUtils": [{}],
        "sap.fpa.bi.filter.utils.public.MeasureBasedFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.ScopedPageFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.LinkedAnalysisFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.RepeatableGroupFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.PromptInputFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.FilterEntityKeyDescriptorBuilder": [{}],
        "sap.fpa.bi.filter.utils.public.BIQueryFilterUtils": [{}],
        "sap.fpa.bi.filter.utils.public.CrossModelFilterUtils": [{}],
        "sap.fpa.bi.filter.filterwrapper.FilterWrapper": [{}],
        "sap.fpa.bi.filter.filterwrapper.FilterWrapperExtender": [{}],
        "sap.fpa.bi.filter.filterwrapper.FilterWrapperInterface": [{}],
        "sap.fpa.bi.filter.Constants": [{}],
        "sap.fpa.bi.filter.controls.factories.IControlSetFactory": [{}],
        "sap.fpa.bi.filter.bw.DynamicVariableFilters": [{}],
        "_sap.fpa.bi.filter.utils.internal.InternalFilterWrapperUtils": [{}],
        "sap.fpa.bi.filter.services.OrcaUQMFilterService": [{}],
        "sap.fpa.bi.inaCache.InACacheService": [{}],
        "sap.fpa.bi.inaCache.InACacheServiceUtils": [{}],
        "sap.fpa.bi.injectFilter.AutoInjectFilterBuilder": [{}],
        "sap.fpa.bi.inputschedule.MessageHelper": [{}],
        "sap.fpa.bi.inputschedule.InputProcessService": [{}],
        "sap.fpa.bi.inputschedule.InputProcessServiceFactory": [{}],
        "sap.fpa.bi.inputschedule.InputSummaryStore": [{}],
        "sap.fpa.bi.inputschedule.InputSummaryReducers": [{}],
        "sap.fpa.bi.inputschedule.InputSummaryActions": [{}],
        "sap.fpa.bi.inputschedule.InputSummaryView": [{}],
        "sap.fpa.bi.inputschedule.InputSummaryController": [{}],
        "sap.fpa.bi.inputschedule.ISStoryModelUtils": [{}],
        "sap.fpa.bi.inputschedule.TaskValidation": [{}],
        "sap.fpa.bi.inputschedule.InputTaskData": [{}],
        "sap.fpa.bi.inputschedule.StoryContentMonitor": [{}],
        "sap.fpa.bi.inputschedule.InputProcessTask": [{}],
        "sap.fpa.bi.jobOrchestration.ComplexFilterTreeModel": [{}],
        "sap.fpa.bi.jobOrchestration.Constants": [{}],
        "sap.fpa.bi.jobOrchestration.Events": [{}],
        "sap.fpa.bi.jobOrchestration.MessageHelper": [{}],
        "sap.fpa.bi.jobOrchestration.ConditionNodeFactory": [{}],
        "sap.fpa.bi.measureService.MeasureService": [{}],
        "sap.fpa.bi.measureService.MeasureServiceFactory": [{}],
        "sap.fpa.bi.measureService.utils.MeasureUtils": [{}],
        "sap.fpa.bi.measureService.processors.MeasureInfoProcessor": [{}],
        "sap.fpa.bi.measureDimensionConfig.MDCSettingHelper": [{}],
        "sap.bi.utils.modelService.ModelService": [{}],
        "sap.bi.utils.modelService.ModelUtilsBase": [{}],
        "sap.bi.utils.modelService.ModelUtils": [{}],
        "sap.bi.utils.modelService.ModelServiceConstants": [{}],
        "sap.fpa.bi.modelService.PrivateModelUtils": [{}],
        "sap.fpa.bi.predictiveService.model._AbstractPredictiveJob": [{}],
        "sap.fpa.bi.predictiveService.model._AbstractPredictiveJobSet": [{}],
        "sap.fpa.bi.predictiveService.model._CubeInfo": [{}],
        "sap.fpa.bi.predictiveService.model.CubeInfoFactory": [{}],
        "sap.fpa.bi.predictiveService.model.DatasetDescriptor": [{}],
        "sap.fpa.bi.predictiveService.helper._PollingManager": [{}],
        "sap.fpa.bi.predictiveService.PredictiveDataService": [{}],
        "sap.fpa.bi.predictiveService.PredictiveFactory": [{}],
        "sap.fpa.bi.predictiveService.PredictiveEnums": [{}],
        "sap.fpa.bi.predictiveService.PredictiveErrorCode": [{}],
        "sap.fpa.bi.predictiveService.PredictiveJobType": [{}],
        "sap.fpa.bi.predictiveService.PredictiveQueryGenerator": [{}],
        "sap.fpa.bi.predictiveService._PredictiveQueryGenerator": [{}],
        "sap.fpa.bi.predictiveService.PredictiveService": [{}],
        "sap.fpa.bi.predictiveService.ForecastSharedUtils": [{}],
        "sap.fpa.bi.predictiveService.PredictiveFilterUtils": [{}],
        "sap.fpa.bi.predictiveService.helper._RequestManager": [{}],
        "sap.fpa.bi.predictiveService.model.TimeSeriesForecastCommand": [{}],
        "sap.fpa.bi.predictiveService.TimeSeriesForecastQueryGenerator": [{}],
        "sap.fpa.bi.predictiveService.model._TimeSeriesForecastResults": [{}],
        "sap.fpa.bi.predictiveService.model.TimeSeriesForecastPreviewResults": [{}],
        "sap.fpa.bi.predictiveService.model.TimeSeriesForecastFireflyResultSet": [{}],
        "sap.fpa.bi.predictiveService.model.InstantForecastJob": [{}],
        "sap.fpa.bi.predictiveService.model.InstantForecastJobSet": [{}],
        "sap.fpa.bi.predictiveService.model.ClusteringJob": [{}],
        "sap.fpa.bi.predictiveService.TimeSeriesForecastService": [{}],
        "sap.fpa.bi.predictiveService.model.TimeSeriesForecastValidator": [{}],
        "sap.fpa.bi.predictiveService.model._TimeSeriesPredictiveAttributes": [{}],
        "sap.fpa.bi.predictiveService.model.ViewpointFactory": [{}],
        "sap.fpa.bi.predictiveService.model._Viewpoint": [{}],
        "sap.fpa.bi.predictiveService.model._BookedDatesGranularityMap": [{}],
        "sap.fpa.bi.predictiveService.model._ForecastRequest": [{}],
        "sap.fpa.bi.predictiveService.Constants": [{}],
        "sap.fpa.bi.predictiveService.helper.PredictiveJobUtils": [{}],
        "sap.fpa.bi.predictiveService.PredictiveJobStatus": [{}],
        "sap.fpa.bi.predictiveService._ModelAttributeGenerator": [{}],
        "sap.fpa.bi.reduxUtils.Constants": [{}],
        "sap.fpa.bi.reduxUtils.StateModel": [{}],
        "sap.fpa.bi.reduxUtils.ReduxStore": [{}],
        "sap.fpa.bi.reduxUtils.Utils": [{}],
        "sap.fpa.bi.richtexteditor.TextEditor": [{}],
        "sap.fpa.bi.richtexteditor.TextEditingSection": [{}],
        "sap.fpa.bi.richtexteditor.MarkupTextUtils": [{}],
        "sap.fpa.bi.richtexteditor.RichTextEditorConstants": [{}],
        "sap.fpa.bi.smartBIService.MessageHelper": [{}],
        "sap.fpa.bi.smartBIService.SmartBIService": [{}],
        "sap.fpa.bi.smartBIService.ServiceManagerForSmartBI": [{}],
        "sap.fpa.bi.smartBIService.SmartBIUtils": [{}],
        "sap.fpa.bi.smartDiscovery.MessageHelper": [{}],
        "sap.fpa.bi.smartDiscovery.ServiceManagerForSmartDiscovery": [{}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoveryImageOverlay": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryUtils": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryDatasetUtils": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryPageUtils": [{}],
        "sap.fpa.bi.smartDiscovery.StylingUtils": [{}],
        "sap.fpa.bi.smartDiscovery.ErrorUtils": [{}],
        "sap.fpa.bi.smartDiscovery.HashUtils": [{}],
        "sap.fpa.bi.smartDiscovery.WarningUtils": [{}],
        "sap.fpa.bi.smartDiscovery.ShowHideUtils": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryConstants": [{}],
        "sap.fpa.bi.smartDiscovery.DiscoverySidePanelInitialState": [{}],
        "sap.fpa.bi.smartDiscovery.DiscoverySidePanelDekuApp": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryManager": [{}],
        "sap.fpa.bi.smartDiscovery.SmartDiscoveryAppBuildingHelper": [{}],
        "sap.fpa.bi.smartDiscovery.InsightsSidePanelController": [{}],
        "sap.fpa.bi.smartDiscovery.EntityFormat": [{}],
        "sap.fpa.bi.smartDiscovery.PredictiveBuilderPanelDekuApp": [{}],
        "sap.fpa.bi.smartDiscovery.PredictiveBuilderPanelInitialState": [{}],
        "sap.fpa.bi.smartDiscovery.KIWidgetTooltip": [{}],
        "sap.fpa.bi.smartDiscovery.ScoringCard": [{}],
        "sap.fpa.bi.smartDiscovery.ScoringConstants": [{}],
        "sap.fpa.bi.smartDiscovery.OutliersTableControl": [{}],
        "sap.fpa.bi.smartDiscovery.OutliersConstants": [{}],
        "sap.fpa.bi.smartDiscovery.OutliersUtils": [{}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoveryDateTimeFormatter": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentBuildDirector": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentPageBuilderEnum": [{}, {}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoveryDatasetService": [{}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoveryCalculationService": [{}],
        "sap.fpa.bi.smartDiscovery._ScoringCalculator": [{}],
        "sap.fpa.bi.smartDiscovery._OverviewContentUtils": [{}],
        "sap.fpa.bi.smartDiscovery._OverviewPageBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._OutliersPageBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._KeyInfluencerPageBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._OverviewContentBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._KeyInfluencerContentBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._ScoringContentBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._ScoringWidgetsContentProvider": [{}],
        "sap.fpa.bi.smartDiscovery._OutliersContentBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._OutliersWidgetsContentProvider": [{}],
        "sap.fpa.bi.smartDiscovery._CombinedInfluencerMenu": [{}],
        "sap.fpa.bi.smartDiscovery._KISectionBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentUIHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentColorPaletteHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentChartBuilder": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentFilterHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoveryCalculationHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentInputControlHelper": [{}],
        "sap.fpa.bi.smartDiscovery._ContentBuilderNameHelper": [{}],
        "sap.fpa.bi.smartDiscovery._ContentBuilderClassificationHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentDynamicTextInputControlHelper": [{}],
        "sap.fpa.bi.smartDiscovery._KeyInfluencerSummaryTextHelper": [{}],
        "sap.fpa.bi.smartDiscovery._KeyInfluencerCombinedInfluencerHelper": [{}],
        "sap.fpa.bi.smartDiscovery._SmartContentTypeEnum": [{}],
        "sap.fpa.bi.smartDiscovery._SmartDiscoverySidePanelController": [{}],
        "sap.fpa.bi.smartDiscovery.components._DropDownWithSearch": [{}],
        "sap.fpa.bi.smartDiscovery.components._IconWithPopup": [{}],
        "sap.fpa.bi.smartDiscovery.components._SingleSelectTreeNode": [{}],
        "sap.fpa.bi.smartDiscovery.components._Token": [{}],
        "sap.fpa.bi.smartDiscovery._DiscoveryInfoHelper": [{}],
        "sap.fpa.bi.smartDiscovery._HelperUtils": [{}],
        "sap.fpa.bi.smartDiscovery._ModelInfoHelper": [{}],
        "sap.fpa.bi.smartDiscovery._InsightsSidePanelView": [{}],
        "sap.fpa.bi.smartDiscovery._DiscoverySidePanelArea": [{}],
        "sap.fpa.bi.smartDiscovery._DiscoveryWrapperFilters": [{}],
        "sap.fpa.bi.smartDiscovery._DiscoverySidePanelActions": [{}],
        "sap.fpa.bi.smartDiscovery._DiscoverySidePanelReducers": [{}],
        "sap.fpa.bi.smartDiscovery._BuilderPanelReducers": [{}],
        "sap.fpa.bi.smartDiscovery._BuilderPanelActions": [{}],
        "sap.fpa.bi.smartDiscovery._BuilderPanelSideArea": [{}],
        "sap.fpa.bi.smartDiscovery._BuilderPanelWrapperSettingsSection": [{}],
        "sap.fpa.bi.smartDiscovery._DialogUtils": [{}],
        "sap.fpa.bi.smartDiscovery._ComponentUtils": [{}],
        "sap.fpa.bi.smartDiscovery._BulletChartUtils": [{}],
        "sap.fpa.bi.smartDiscovery._StateUtils": [{}],
        "sap.fpa.bi.smartDiscovery.contentBuilder._KIWidgetContentProvider": [{}],
        "sap.fpa.bi.smartDiscovery.controls.outliers._SlickGridWrapper": [{}],
        "sap.fpa.bi.smartDiscovery.controls.outliers._TableColumnPicker": [{}],
        "sap.fpa.bi.smartDiscovery.controls.outliers.tableModel._RegressionTableModel": [{}],
        "sap.fpa.bi.smartDiscovery.services._PlaceholderPageService": [{}],
        "sap.fpa.bi.smartDiscovery.services._PredictiveDataFetcherService": [{}],
        "sap.fpa.bi.smartDiscovery._PredictiveRowCountService": [{}],
        "sap.fpa.bi.smartDiscovery.workflow._PredictiveEntityDataProvider": [{}],
        "sap.fpa.bi.smartDiscovery.workflow._PredictiveWorkflow": [{}],
        "sap.fpa.bi.smartDiscovery.workflow._PredictiveWorkflowService": [{}],
        "sap.fpa.bi.smartDiscovery.workflow._WorkflowModelPath": [{}],
        "sap.fpa.bi.smartDiscovery.controls._RunSmartDiscoveryDialog": [{}],
        "sap.fpa.bi.smartDiscovery._DataLimitUtils": [{}],
        "sap.fpa.bi.smartDiscovery._VizNumberFormatBuilder": [{}],
        "sap.fpa.bi.smartDiscovery.predictiveWidgets._PredictiveWidgetCustomDataBuilder": [{}],
        "sap.fpa.bi.smartDiscovery.entitySelection._DiscoveryEntitySelectionBuilder": [{}],
        "sap.fpa.bi.template.TemplateCreationService": [{}],
        "sap.fpa.bi.template.TemplateService": [{}],
        "sap.fpa.bi.template.ApplyLayoutService": [{}],
        "sap.fpa.bi.template.svg.SVGGenerator": [{}],
        "sap.fpa.bi.template.svg.SVGThemeManager": [{}],
        "sap.fpa.bi.template.svg.SVGGeneratorMode": [{}],
        "sap.fpa.bi.template.svg.provider.CanvasPageProvider": [{}],
        "sap.fpa.bi.template.svg.provider.ResponsivePageProvider": [{}],
        "sap.fpa.bi.template.TemplateUtils": [{}],
        "sap.fpa.bi.template.ThumbnailGenerator": [{}],
        "sap.fpa.bi.threshold.ThresholdEdit": [{}],
        "sap.fpa.bi.threshold.ThresholdPreview": [{}],
        "sap.fpa.bi.threshold.ThresholdList": [{}],
        "sap.fpa.bi.threshold.ThresholdSymbolPicker": [{}],
        "sap.fpa.bi.threshold.ColorRulesList": [{}],
        "sap.fpa.bi.threshold.ThresholdPanelContainer": [{}],
        "sap.fpa.bi.threshold.util.ThresholdConstant": [{}],
        "sap.fpa.bi.threshold.util.ThresholdThemeConstant": [{}],
        "sap.fpa.bi.threshold.util.DatasetPickerConstant": [{}],
        "sap.fpa.bi.threshold.util.ThresholdSource": [{}],
        "sap.fpa.bi.threshold.util.ThresholdUnit": [{}],
        "sap.fpa.bi.threshold.util.UQMExternalThresholdAdaptor": [{}],
        "sap.fpa.bi.threshold.util.UQMThresholdServiceUtils": [{}],
        "sap.fpa.bi.threshold.ThresholdFilter": [{}],
        "sap.fpa.bi.threshold.DatasetAliasHelper": [{}],
        "sap.fpa.bi.threshold.ThresholdPanelType": [{}],
        "sap.fpa.bi.threshold.ThresholdColor": [{}],
        "sap.fpa.bi.threshold.ThresholdManagerFactory": [{}],
        "sap.fpa.bi.threshold.ThresholdManagerEvents": [{}],
        "sap.fpa.bi.threshold.ThresholdType": [{}],
        "sap.fpa.bi.threshold.ThresholdUnit": [{}],
        "sap.fpa.bi.threshold.IntervalValidatorService": [{}],
        "sap.fpa.bi.threshold.IntervalsValidatorService": [{}],
        "sap.fpa.bi.threshold.IntervalsItem": [{}],
        "sap.fpa.bi.threshold.IntervalSuggestion": [{}],
        "sap.fpa.bi.threshold.ThresholdUtil": [{}],
        "sap.fpa.bi.threshold.ThresholdUIUtilities": [{}],
        "sap.fpa.bi.threshold.ChartThresholdMenu": [{}],
        "sap.fpa.bi.threshold.ui.ThresholdEvents": [{}],
        "sap.fpa.bi.threshold.ui.IntervalsVisualization": [{}],
        "sap.fpa.bi.threshold.ui.SwitchersSection": [{}],
        "sap.fpa.bi.translationService.TranslationService": [{}],
        "sap.fpa.bi.translationService.TranslationExtractor": [{}],
        "sap.fpa.bi.translationService.TranslationTextField": [{}],
        "sap.fpa.bi.translationService.translators.AliasTranslator": [{}],
        "sap.fpa.bi.translationService.translators.GenericAliasTranslator": [{}],
        "sap.fpa.bi.translationService.translators.DynamicTableTranslator": [{}],
        "sap.fpa.bi.translationService.translators.FsicTranslator": [{}],
        "sap.fpa.bi.translationService.translators.HeaderWidgetTranslator": [{}],
        "sap.fpa.bi.translationService.translators.IframeTranslator": [{}],
        "sap.fpa.bi.translationService.translators.PlanningFlowTranslator": [{}],
        "sap.fpa.bi.translationService.translators.PlanningSequenceTriggerTranslator": [{}],
        "sap.fpa.bi.translationService.translators.MultiActionsTriggerTranslator": [{}],
        "sap.fpa.bi.translationService.translators.FileUploadTriggerTranslator": [{}],
        "sap.fpa.bi.translationService.translators.RssWidgetTranslator": [{}],
        "sap.fpa.bi.translationService.translators.TextWidgetTranslator": [{}],
        "sap.fpa.bi.translationService.translators.ThresholdsTranslator": [{}],
        "sap.fpa.bi.translationService.translators.FilterInputControlTranslator": [{}],
        "sap.fpa.bi.translationService.translators.CustomCurrentDateTranslator": [{}],
        "sap.fpa.bi.translationService.translators.GeoTranslator": [{}],
        "sap.fpa.bi.translationService.translators.GdicTranslator": [{}],
        "sap.fpa.bi.translationService.translators.InfochartTranslator": [{}],
        "sap.fpa.bi.translationService.translators.CalculationTranslator": [{}],
        "sap.fpa.bi.translationService.translators.CalculationVariableTranslator": [{}],
        "sap.fpa.bi.translationService.translators.RWidgetTranslator": [{}],
        "sap.fpa.bi.translationService.translators.CustomSortTranslator": [{}],
        "sap.fpa.bi.uqm.UQMLoader": [{}],
        "sap.fpa.bi.uqm.UQMLoaderFactory": [{}],
        "sap.fpa.bi.uqm.UQMStoryQueryUtils": [{}],
        "sap.fpa.bi.uqm.UQMStoryVariableUtils": [{}],
        "sap.fpa.bi.uqmLegacyDialogs.UQMLegacyDialogsControlsLoader": [{}],
        "sap.fpa.bi.uqmMigration.UQMMigrationUtils": [{}],
        "sap.fpa.bi.uqmMigration.UnsupportedFeatures": [{}],
        "sap.fpa.bi.uqmQueryPersistencyService.UQMQueryPersistencyService": [{}],
        "sap.fpa.bi.uqmQueryPersistencyService.UQMQueryPersistencyServiceFactory": [{}],
        "sap.fpa.bi.uqmQueryPersistencyService.UQMQueryPersistencyUtils": [{}],
        "sap.fpa.bi.variableLink.VariableLinkService": [{}],
        "sap.fpa.bi.variableLink.VariableBaseService": [{}],
        "sap.fpa.bi.visualization.MessageHelper": [{}],
        "sap.fpa.bi.visualization.VisualizationUtils": [{}],
        "sap.fpa.bi.visualization.VisualizationSourceTypeEnum": [{}],
        "sap.fpa.bi.visualization.Helpers.JoinModelHelper": [{}],
        "sap.fpa.bi.visualization.Helpers.VersionFilterHelper": [{}],
        "sap.fpa.bi.visualization.Helpers.VarianceHelper": [{}],
        "sap.fpa.bi.visualization.Helpers.DrillHelper": [{}],
        "sap.fpa.bi.visualization.Helpers.PatternAndColorHelper": [{}],
        "sap.fpa.bi.visualization.VisualizationControl": [{}],
        "sap.fpa.bi.visualization.VisualizationModelService": [{}],
        "sap.fpa.bi.visualization.VisualizationContextFactory": [{}],
        "sap.fpa.bi.visualization.VisualizationSerializer": [{}],
        "sap.fpa.bi.visualization.VisualizationValidator": [{}],
        "sap.fpa.bi.visualization.RankingHelper": [{}],
        "sap.fpa.bi.visualization.FeedUtils": [{}],
        "sap.fpa.bi.visualization.TruncationUtils": [{}],
        "sap.fpa.bi.visualization.VisualizationStoreRegistration": [{}],
        "sap.fpa.bi.visualization.TokenFactory": [{}],
        "sap.fpa.bi.visualization.VizSelectors": [{}],
        "sap.fpa.bi.visualization.constants.Constants": [{}],
        "sap.fpa.bi.visualization.TokenContainer": [{}],
        "sap.fpa.bi.visualization.FilterToken": [{}],
        "sap.fpa.bi.visualization.control.FilterTokenToolTipContent": [{}],
        "sap.fpa.bi.visualization.control.HierarchyLevelMenuContent": [{}],
        "sap.fpa.bi.visualization._WidgetMenuBuilder": [{}],
        "sap.fpa.bi.visualization.HierarchyLevelHelper": [{}],
        "sap.fpa.bi.visualization._InteractionManager": [{}],
        "sap.fpa.bi.visualization._ActionMenu": [{}],
        "sap.fpa.bi.visualization._SetAxisRangeDialog": [{}],
        "sap.fpa.bi.visualization.ChartBindingsAdapter": [{}],
        "sap.fpa.bi.visualization.DataFetcherFactory": [{}],
        "sap.fpa.bi.visualization.utils.ChartAutoLimiter": [{}],
        "sap.fpa.bi.visualization.utils.MagnitudeConverter": [{}],
        "sap.fpa.bi.visualization.utils.VarianceAdapter": [{}],
        "sap.fpa.bi.visualization.utils.ErrorBarVizUtils": [{}],
        "sap.fpa.bi.visualization.utils.CustomSortVizUtils": [{}],
        "sap.fpa.bi.visualization.utils.FeedUtils": [{}],
        "sap.fpa.bi.visualization.utils.AxisLineVizUtils": [{}],
        "sap.fpa.bi.visualization.utils.VizColorUtils": [{}],
        "sap.fpa.bi.visualization.utils.VizSplitPaneExtension": [{}],
        "sap.fpa.bi.visualization.VizAdapterInjectedDependencies": [{}],
        "sap.fpa.bi.visualization.utils.VizMemberSelector": [{}],
        "sap.fpa.bi.visualization.CGRUtils": [{}],
        "sap.fpa.bi.visualization.utils.ChartDataFetcher": [{}],
        "sap.fpa.bi.visualization.utils.DynamicTextVizUtils": [{}],
        "sap.fpa.bi.visualization.utils._ElementSelectionUtils": [{}],
        "sap.fpa.bi.visualization.utils._HyperlinkDimensionFetcher": [{}],
        "sap.fpa.bi.visualization.utils._ReferenceLineUtils": [{}],
        "sap.fpa.bi.visualization.utils._TextVisibilityHandler": [{}],
        "sap.fpa.bi.visualization.utils._VizStylingSettingsUtils": [{}],
        "sap.fpa.bi.visualization.helpers._AxisDensityHelper": [{}],
        "sap.fpa.bi.visualization.helpers._ReferenceLineDynamicTable": [{}],
        "sap.fpa.bi.visualization.utils._ReferenceLineDynamicTableAdapter": [{}],
        "sap.fpa.bi.visualization.helpers._DrillHelper": [{}],
        "sap.fpa.bi.visualization.helpers._FilterHelper": [{}],
        "sap.fpa.bi.visualization.helpers._FpaChartHelper": [{}],
        "sap.fpa.bi.visualization.helpers._CommonHelper": [{}],
        "sap.fpa.bi.visualization._ChartService": [{}],
        "sap.fpa.bi.visualization._CustomTooltip": [{}],
        "sap.fpa.bi.visualization.FilterTokenHelper": [{}],
        "sap.fpa.bi.visualization.QueryGenerator": [{}],
        "sap.fpa.bi.visualization.utils.FlatTableDataSetUtils": [{}],
        "sap.fpa.bi.visualization.utils._TooltipUtils": [{}],
        "sap.fpa.bi.visualization.utils._SelectionTooltipViews": [{}],
        "sap.fpa.bi.visualization.utils.ResponsivePropertiesDecorator": [{}],
        "sap.fpa.bi.visualization.utils.VarianceContainerVizUtils": [{}],
        "sap.fpa.bi.visualization.WidgetMenuBuilder": [{}],
        "sap.fpa.bi.visualization.helpers.SortHelper": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability.SmartInsightsMenuCapability": [{}],
        "sap.fpa.bi.visualization.VisualizationThemingService": [{}],
        "sap.fpa.bi.visualization.GroupActionManager": [{}],
        "sap.fpa.bi.visualization._GroupActionState": [{}],
        "sap.fpa.bi.visualization._GroupActionCapabilities": [{}],
        "sap.fpa.bi.visualization._GroupActionMenuBuilder": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastPickerListItem": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastPickerList": [{}],
        "sap.fpa.bi.visualization.forecast._AdditionalInputsService": [{}],
        "sap.fpa.bi.visualization.forecast._ClusteringFlatTableDatasetConvertHelper": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastFlatTableDatasetConverter": [{}],
        "sap.fpa.bi.visualization.forecast._KeyValueSeries": [{}],
        "sap.fpa.bi.visualization.forecast._InstantForecastQualityTokenPopup": [{}],
        "sap.fpa.bi.visualization.forecast.PredictiveClusteringManager": [{}],
        "sap.fpa.bi.visualization.forecast.PredictiveClusteringHelper": [{}],
        "sap.fpa.bi.visualization.forecast.PredictiveClusteringTokenPopup": [{}],
        "sap.fpa.bi.visualization.forecast.ForecastManager": [{}],
        "sap.fpa.bi.visualization.forecast.ForecastTimeMember": [{}],
        "sap.fpa.bi.visualization.forecast.CachedPredictiveQueryService": [{}],
        "sap.fpa.bi.visualization.forecast.ForecastVizErrorCode": [{}],
        "sap.fpa.bi.visualization.forecastViz.ForecastVizEnums": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastWarningStateManager": [{}],
        "sap.fpa.bi.visualization.warnings._VisualizationWarningHandler": [{}],
        "sap.fpa.bi.visualization.referenceLine.ReferenceLineHandler": [{}],
        "sap.fpa.bi.visualization.timestamp.TimestampHandler": [{}],
        "sap.fpa.bi.visualization.utils.TimeSelectionUtils": [{}],
        "sap.fpa.bi.visualization._VisualizationModel": [{}],
        "sap.fpa.bi.visualization._VisualizationModelActions": [{}],
        "sap.fpa.bi.visualization._VisualizationSettings": [{}],
        "sap.fpa.bi.visualization.utils.HyperlinkUtils": [{}],
        "sap.fpa.bi.visualization.menu._HyperlinkActionMenuHandler": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastActionMenu": [{}],
        "sap.fpa.bi.visualization.forecast._VariableData": [{}],
        "sap.fpa.bi.visualization.forecast._VariableContext": [{}],
        "sap.fpa.bi.visualization.forecast.PredictiveUsageTrackerUtils.ForecastTrackerUtils": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastAdditionalInputsControl": [{}],
        "sap.fpa.bi.visualization.forecast._ForecastForm": [{}],
        "sap.fpa.bi.visualization.color.ColorHandler": [{}],
        "sap.fpa.bi.visualization.datafetcher.DefaultChartQueryProcessor": [{}],
        "sap.fpa.bi.visualization.datafetcher.WaterfallQueryProcessor": [{}],
        "sap.fpa.bi.visualization.datafetcher.HistogramQueryProcessor": [{}],
        "sap.fpa.bi.visualization.datafetcher.HistogramResultProcessor": [{}],
        "sap.fpa.bi.visualization.datafetcher.WaterfallDrillProcessor": [{}],
        "sap.fpa.bi.visualization.datafetcher._FetchDrillEntities": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability.DrillWaterfallMenuCapability": [{}],
        "sap.fpa.bi.visualization.thresholds.ThresholdHandler": [{}],
        "sap.fpa.bi.visualization.selection.ChartSelections": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability._ExpandMenuCapability": [{}],
        "sap.fpa.bi.visualization._DatasetsModel": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability._NavigateFilterMenuCapability": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability._ThresholdMenuCapability": [{}],
        "sap.fpa.bi.visualization.actionmenu.capability._IntentNavigationMenuCapability": [{}],
        "sap.fpa.bi.visualization.BWVizHandler": [{}],
        "sap.fpa.bi.visualization.VisualizationWorkflow": [{}],
        "sap.fpa.bi.visualization.InitWorkflow": [{}],
        "sap.fpa.bi.visualization.UpdateWorkflow": [{}],
        "sap.fpa.bi.visualization.CommonWorkflow": [{}],
        "sap.fpa.bi.visualization.utils.VizDimensionMemberOrders": [{}],
        "sap.fpa.bi.visualization.provider.ChartCopyPasteProvider": [{}],
        "sap.fpa.bi.visualization.provider.BwHierarchyPreloadProvider": [{}],
        "sap.fpa.bi.visualization.utils.ChartContextualFormattings": [{}],
        "sap.fpa.bi.viz.VizAPI": [{}],
        "sap.fpa.bi.viz.variance.StandaloneVarianceUtils": [{}],
        "sap.fpa.bi.vizFactory.VizFactory": [{}],
        "sap.lumira.vizFactory.ReportConversion": [{}],
        "sap.fpa.bi.widget.DefaultChartTooltip": [{}],
        "sap.fpa.bi.widget.CommonCustomTooltip": [{}],
        "sap.fpa.bi.widget._CommonCustomTooltipChart": [{}],
        "sap.fpa.bi.widgetgroup.WidgetGroupService": [{}],
        "sap.fpa.bi.pagegroup.PageGroupServiceManager": [{}],
        "sap.fpa.bi.pagegroup.PageGroupServiceUtils": [{}],
        "sap.fpa.bi.pagegroup.PageGroupType": [{}],
        "sap.fpa.bi.pagegroup.PageGroupForwardConverter": [{}],
        "sap.fpa.bi.pagegroup.pageGroup.PageGroup": [{}],
        "sap.fpa.bi.pagegroup.pageGroup.DefaultPageGroup": [{}],
        "sap.fpa.bi.pagegroup.pageGroup.ScopedPageGroup": [{}],
        "sap.fpa.bi.pagegroup.pageGroup.LinkedAnalysisGroup": [{}],
        "sap.fpa.bi.pagegroup.pageGroupService.DefaultPageGroupService": [{}],
        "sap.fpa.bi.pagegroup.pageGroupService.ScopedPageGroupService": [{}],
        "sap.fpa.bi.pagegroup.RepeatableGroupService": [{}],
        "sap.fpa.bi.pagegroup.pageGroupService.LinkedAnalysisGroupService": [{}],
        "sap.fpa.planning.dataEntry.events.UIEventHandler": [{}],
        "sap.fpa.planning.dataEntry.events.Events": [{}],
        "sap.fpa.planning.dataEntry.FluidDataEntryManager": [{}],
        "sap.fpa.planning.dataEntry.FluidDataEntryHandler": [{}],
        "sap.fpa.planning.dataEntry.DeletionHandler": [{}],
        "sap.fpa.planning.dataEntry.DataEntryManager": [{}],
        "sap.fpa.planning.dataEntry.DeleteFactsManager": [{}],
        "sap.fpa.planning.dataEntry.MassDataEntryManager": [{}],
        "sap.fpa.planning.dataEntry.MassDataEntryHelper": [{}],
        "sap.fpa.planning.dataEntry.CellDependencyMatrixV2": [{}],
        "sap.fpa.planning.dataEntry.MDEToolbarManager": [{}],
        "sap.fpa.planning.dataEntry.MassDataEntryAdapter": [{}],
        "sap.fpa.planning.dataEntry.interface.IFluidDataEntryManager": [{}],
        "sap.fpa.planning.dataEntry.interface.ITableControllerCallbacks": [{}],
        "sap.fpa.planning.dataEntry.uqmTable.UqmTablePlanning": [{}],
        "sap.fpa.planning.dataEntry.uqmTable.UqmTablePlanningUtils": [{}],
        "sap.fpa.planning.dataEntry.uqmTable.OrcaTablePlanning": [{}],
        "sap.fpa.planning.dataEntry.uqmTable.inputReadiness.InputReadinessManager": [{}],
        "sap.fpa.planning.dataEntry.common.LogHelper": [{}],
        "sap.fpa.planning.dataEntry.common.PerfHelper": [{}],
        "sap.fpa.planning.dataEntry.common.PlanningUtils": [{}],
        "sap.fpa.planning.dataEntry.common.ExtendPlanningAreaController": [{}],
        "sap.fpa.planning.dataEntry.SacPlanningPanelAdapter": [{}],
        "sap.fpa.planning.forecastLayout.CutoverDateValue": [{}],
        "sap.fpa.planning.forecastLayout.FlexibleDate": [{}],
        "sap.fpa.planning.forecastLayout.ForecastLayoutFilterMembers": [{}],
        "sap.fpa.planning.forecastLayout.ForecastLayoutManager": [{}],
        "sap.fpa.planning.forecastLayout.ForecastLayoutSidePanel": [{}],
        "sap.fpa.planning.forecastLayout.ForecastLayoutUtility": [{}],
        "sap.fpa.planning.forecastLayout.ForecastLayoutExternalObject": [{}],
        "sap.fpa.planning.memberOnTheFly.MemberOnTheFlyService": [{}],
        "sap.fpa.planning.memberOnTheFly.MemberOnTheFlyServiceFactory": [{}],
        "sap.fpa.planning.version.VersionManager": [{}],
        "sap.fpa.planning.version.PrivateVersion": [{}],
        "sap.fpa.planning.version.PublicVersion": [{}],
        "sap.fpa.planning.version.Version": [{}],
        "sap.fpa.planning.version.UndoHandlers": [{}],
        "sap.fpa.planning.version.VersionService": [{}],
        "sap.fpa.planning.version.VersionUIController": [{}],
        "sap.fpa.planning.table.ModelConstants": [{}],
        "sap.fpa.planning.table.ResultSetCursor": [{}],
        "sap.fpa.planning.table.ResultSetCursorHiddenTuple": [{}],
        "sap.fpa.planning.table.ManagementObject": [{}],
        "sap.fpa.planning.table.MessageBase": [{}],
        "sap.fpa.planning.table.CalculationBase": [{}],
        "sap.fpa.planning.table.CalculationMetadataBase": [{}],
        "sap.fpa.planning.table.CellContextBase": [{}],
        "sap.fpa.planning.table.KeyDescriptorBase": [{}],
        "sap.fpa.planning.table.CoordinateBase": [{}],
        "sap.fpa.planning.table.RelativeCoordinateBase": [{}],
        "sap.fpa.planning.table.HeaderProperty": [{}],
        "sap.fpa.planning.table.CellBase": [{}],
        "sap.fpa.planning.table.DataCellBase": [{}],
        "sap.fpa.planning.table.GridBase": [{}],
        "sap.fpa.planning.table.SegmentBase": [{}],
        "sap.fpa.planning.table.DataSourceBase": [{}],
        "sap.fpa.planning.table.DimensionBase": [{}],
        "sap.fpa.planning.table.DataRegionNumberBase": [{}],
        "sap.fpa.planning.table.DataRegionBase": [{}],
        "sap.fpa.planning.table.DataCellStorage": [{}],
        "sap.fpa.planning.table.DataRegionQueryAccessorBase": [{}],
        "sap.fpa.planning.table.DataRegionOblivious": [{}],
        "sap.fpa.planning.table.DataRegionObliviousAttribute": [{}],
        "sap.fpa.planning.table.DataRegionProcessorBase": [{}],
        "sap.fpa.planning.table.DataRegionPreProcessorBase": [{}],
        "sap.fpa.planning.table.DataRegionProcessorHelperBase": [{}],
        "sap.fpa.planning.table.DeferredPromise": [{}],
        "sap.fpa.planning.table.FormulaRange": [{}],
        "sap.fpa.planning.table.TableFeatureToggleService": [{}],
        "sap.fpa.planning.table.Utilities": [{}],
        "sap.fpa.planning.table.IFireflyService": [{}],
        "sap.fpa.planning.table.IVirtualCalculation": [{}],
        "sap.fpa.planning.table.TableQueryManager": [{}],
        "sap.fpa.planning.table.TitleChunk": [{}],
        "sap.fpa.planning.table.DependencyNode": [{}],
        "sap.fpa.planning.table.DependencyTree": [{}],
        "sap.fpa.planning.table.FireflyHierarchyTree": [{}],
        "sap.fpa.planning.table.FormulaBase": [{}],
        "sap.fpa.planning.table.InputReadiness": [{}],
        "sap.fpa.planning.table.CalculationVariableId": [{}],
        "sap.fpa.planning.table.ForecastLayout": [{}],
        "sap.fpa.planning.table.ForecastLayoutAdditionalVersion": [{}],
        "sap.fpa.planning.table.CellValueValidateException": [{}],
        "sap.fpa.planning.table.RangeBase": [{}],
        "sap.fpa.planning.table.calculation.FormulaExceptions": [{}],
        "sap.fpa.planning.table.calculation.FormulaProcessorBase": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculationService": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculationFactory": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculationMathWrapper": [{}],
        "sap.fpa.planning.table.calculation.VirtualThresholdItem": [{}],
        "sap.fpa.planning.table.calculation.VirtualThresholdService": [{}],
        "sap.fpa.planning.table.calculation.VirtualTupleElement": [{}],
        "sap.fpa.planning.table.calculation.FormularProcessorBase": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculation": [{}],
        "sap.fpa.planning.table.calculation.VirtualMember": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculationValue": [{}],
        "sap.fpa.planning.table.calculation.VirtualCalculationMetadata": [{}],
        "sap.fpa.planning.table.calculation.VirtualMemberMetadata": [{}],
        "sap.fpa.planning.table.formattingStyle.BorderBase": [{}],
        "sap.fpa.planning.table.formattingStyle.CellChartSettingBase": [{}],
        "sap.fpa.planning.table.formattingStyle.DataRegionNumber": [{}],
        "sap.fpa.planning.table.formattingStyle.DataRegionTemplateManagerBase": [{}],
        "sap.fpa.planning.table.formattingStyle.DefaultTemplateListBase": [{}],
        "sap.fpa.planning.table.formattingStyle.FormattingManagerBase": [{}],
        "sap.fpa.planning.table.formattingStyle.FontBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleRuleProcessorBase": [{}],
        "sap.fpa.planning.table.formattingStyle.LineBase": [{}],
        "sap.fpa.planning.table.formattingStyle.NumberBase": [{}],
        "sap.fpa.planning.table.formattingStyle.NumberFormatConstants": [{}],
        "sap.fpa.planning.table.formattingStyle.NumberScaleOverride": [{}],
        "sap.fpa.planning.table.formattingStyle.PartialStyleBase": [{}],
        "sap.fpa.planning.table.formattingStyle.PatternBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleBase": [{}],
        "sap.fpa.planning.table.formattingStyle.TableStyleBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleManagerBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleConstants": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleLibBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleLibManagerBase": [{}],
        "sap.fpa.planning.table.formattingStyle.TypeSettingBase": [{}],
        "sap.fpa.planning.table.formattingStyle.AdhocStyleRuleHelperBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleRuleBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleRuleMemberBase": [{}],
        "sap.fpa.planning.table.formattingStyle.StylePreferenceUtils": [{}],
        "sap.fpa.planning.table.formattingStyle.StyleUtilities": [{}],
        "sap.fpa.planning.table.formattingStyle.MeasureFormatUtilities": [{}],
        "sap.fpa.planning.table.common.SelectionContextUtilsBase": [{}],
        "sap.fpa.planning.table.common.SortedCubeBase": [{}],
        "sap.fpa.planning.table.common.SortedCubeTupleBase": [{}],
        "sap.fpa.planning.table.common.FormulaAndFormatUtils": [{}],
        "sap.fpa.planning.table.common.MathJsService": [{}],
        "sap.fpa.planning.table.BWHelper": [{}],
        "sap.fpa.planning.table.StoryCalculation": [{}],
        "sap.fpa.planning.table.PlanningHelper": [{}],
        "sap.fpa.planning.table.PartialProcessing": [{}],
        "sap.fpa.planning.table.IPlanningService": [{}],
        "sap.fpa.planning.table.IModelInterface": [{}],
        "sap.fpa.planning.table.CellReferenceManagerBase": [{}],
        "sap.fpa.planning.table.VisibilityFilterManagerBase": [{}],
        "sap.fpa.planning.table.PlanningUtilities": [{}],
        "sap.lumira.document.Document": [{}],
        "sap.lumira.document.DatasetLinkFilterService": [{}],
        "sap.lumira.document.DatasetLinkFilterServiceFactory": [{}],
        "sap.lumira.document.DatasetLinkConverter": [{}],
        "sap.lumira.document.DatasetLinkService": [{}],
        "sap.lumira.document.DatasetLinkServiceFactory": [{}],
        "sap.lumira.entityService.EntityServiceConstants": [{}],
        "sap.lumira.entityService.EntityModelService": [{}],
        "sap.lumira.entityService.MinMaxDataProvider": [{}],
        "sap.lumira.entityService.EntityDataProvider": [{}],
        "sap.lumira.entityService.EntityDataProviderHelper": [{}],
        "sap.lumira.entityService.EntityType": [{}],
        "sap.lumira.entityService.AnalyticalType": [{}],
        "sap.lumira.entityService.EntitySubtype": [{}],
        "sap.lumira.entityService.SemanticType": [{}],
        "sap.lumira.entityService.AttributeSemanticType": [{}],
        "sap.lumira.entityService.AttributeType": [{}],
        "sap.lumira.entityService.ValueType": [{}],
        "sap.lumira.entityService.HierarchyLevelInfo": [{}],
        "sap.lumira.entityService.EntityModelUtils": [{}],
        "sap.lumira.entityService.EntityModelBWUtils": [{}],
        "sap.lumira.entityService.AllEntitiesUtils": [{}],
        "sap.lumira.entityService.EntityModelHelper": [{}],
        "sap.lumira.entityService.EntityError": [{}],
        "sap.lumira.entityService.VarianceType": [{}],
        "sap.lumira.entityService.ObjectQueryService": [{}],
        "sap.lumira.entityService.date.DateManipulatorFactory": [{}],
        "sap.lumira.entityService.date.DateManipulatorHelper": [{}],
        "sap.lumira.entityService.date.DateTimeValueUtils": [{}],
        "sap.lumira.entityService.Dataset": [{}],
        "sap.lumira.entityService.DisplayValueFormatter": [{}],
        "sap.lumira.entityService.HyperlinkDisplayValueFormatter": [{}],
        "sap.lumira.entityService.ModelDelegateHelper": [{}],
        "sap.lumira.entityService.MinimumDrillstateUtils": [{}],
        "sap.lumira.entityService.MinimumDrillstateWarningMessages": [{}],
        "sap.lumira.entityService.MinimumDrillstateTooltipBuilder": [{}],
        "sap.lumira.entityService.EntityLOVService": [{}],
        "sap.lumira.entityService.QueryManagerFactory": [{}],
        "sap.lumira.entityService.date.FlexibleCalendarContent": [{}],
        "sap.lumira.geo.ESRIManager": [{}],
        "sap.lumira.geomap.GeoPreloader": [{}],
        "sap.lumira.geomap.esri": [{}],
        "sap.lumira.geomap.GeoSidePanelContainer": [{}],
        "sap.lumira.geomap.GeoWidgetHeaderControl": [{}],
        "sap.lumira.geomap.GeoWidgetMapControl": [{}],
        "sap.lumira.geomap.GeoInfoMessage": [{}],
        "sap.lumira.geomap.GeoInfoArea": [{}],
        "sap.lumira.geomap.GeoSelectableControls": [{}, {}],
        "sap.lumira.geomap.GeoTheme": [{}],
        "sap.lumira.geomap.GeoControl": [{}],
        "sap.lumira.geomap.GeoComponentLoader": [{}],
        "sap.lumira.geomap.inputcontrols.GeoDistanceInputControl": [{}],
        "sap.lumira.geomap.inputcontrol.GeoDistanceInputControlFactory": [{}],
        "sap.lumira.geomap.inputcontrol.InputControlService": [{}],
        "sap.lumira.geomap.GeoThemingService": [{}],
        "sap.lumira.geomap.MessageHelper": [{}],
        "sap.lumira.geomap.GeoFileUploader": [{}],
        "sap.lumira.geomap.MapChartTooltip": [{}],
        "sap.lumira.geomap.MapHeader": [{}],
        "sap.lumira.geomap.MapToolBar": [{}],
        "sap.lumira.geomap.MapActionsToolbar": [{}],
        "sap.lumira.geomap.EnhancedTouchMapActionsToolbar": [{}],
        "sap.lumira.geomap.EnhancedTouchMainActionMenu": [{}],
        "sap.lumira.geomap.EnhancedTouchGeoLegendPanel": [{}],
        "sap.lumira.geomap.MapButtonBar": [{}],
        "sap.lumira.geomap.MapTooltip": [{}],
        "sap.lumira.geomap.MapTooltipList": [{}],
        "sap.lumira.geomap.MapToolSelector": [{}],
        "sap.lumira.geomap.MapTools": [{}],
        "sap.lumira.geomap.GeoWidgetMenuActions": [{}],
        "sap.lumira.geomap.GeoWidgetLegendMenuItem": [{}],
        "sap.lumira.geomap.IconTextToken": [{}],
        "sap.lumira.geomap.IconTextTokenItem": [{}],
        "sap.lumira.geomap.TopNLayerContainer": [{}],
        "sap.lumira.geomap.HierarchyControl": [{}],
        "sap.lumira.geomap.TopNHierarchyControl": [{}],
        "sap.lumira.geomap.MultiLevelsHierarchyControl": [{}],
        "sap.lumira.geomap.MultiLevelsHierarchyContainer": [{}],
        "sap.lumira.geomap.ProgressIndicatorService": [{}],
        "sap.lumira.geomap.MobileGeoFeatureManager": [{}],
        "sap.lumira.geomap.MobileWebviewGeoFeatureManager": [{}],
        "sap.lumira.geocommon.controllers.BaseLayerVizController": [{}],
        "sap.lumira.geocommon.controllers.BaseMapVizController": [{}],
        "sap.lumira.geocommon.layers.BaseLayer": [{}],
        "sap.lumira.geodata.actions.FilterDeleteAction": [{}],
        "sap.lumira.geodata.actions.FilterIncludeAction": [{}],
        "sap.lumira.geodata.actions.FilterExcludeAction": [{}],
        "sap.lumira.geodata.actions.MapAction": [{}],
        "sap.lumira.geodata.actions.LayerAction": [{}],
        "sap.lumira.geodata.actions.PolygonActionHelper": [{}],
        "sap.lumira.geodata.actions.PolygonFilterAction": [{}],
        "sap.lumira.geodata.actions.RemovePolygonAction": [{}],
        "sap.lumira.geodata.actions.SinglePointSelectAction": [{}],
        "sap.lumira.geodata.actions.SinglePolygonDrawingSelectAction": [{}],
        "sap.lumira.geodata.actions.SinglePolygonSelectAction": [{}],
        "sap.lumira.geodata.actions.SingleSelectAction": [{}],
        "sap.lumira.geodata.actions.AddFilterAction": [{}],
        "sap.lumira.geodata.actions.AddFilterExcludeAction": [{}],
        "sap.lumira.geodata.actions.AddFilterIncludeAction": [{}],
        "sap.lumira.geodata.actions.ChoroplethLayerAction": [{}],
        "sap.lumira.geodata.actions.DrillAction": [{}],
        "sap.lumira.geodata.actions.DrillDownAction": [{}],
        "sap.lumira.geodata.actions.DrillUpAction": [{}],
        "sap.lumira.geodata.query.ClusteringManager": [{}],
        "sap.lumira.geodata.query.FeatureManager": [{}],
        "sap.lumira.geodata.query.GeoQueryManager": [{}],
        "sap.lumira.geodata.query.LayerDataAdapter": [{}],
        "sap.lumira.geodata.query.PromiseManager": [{}],
        "sap.lumira.geodata.filters.FilterService": [{}],
        "sap.lumira.geodata.filters.FilterRef": [{}],
        "sap.lumira.geodata.filters.LayerFilterService": [{}],
        "sap.lumira.geodata.filters.ExternalFilterService": [{}],
        "sap.lumira.geodata.filters.LocalVizFilterService": [{}],
        "sap.lumira.geodata.filters.FilterModel": [{}],
        "sap.lumira.geodata.filters.LayerFilterModel": [{}],
        "sap.lumira.geodata.filters.FilterActions": [{}],
        "sap.lumira.geodata.filters.FilterPanelActions": [{}],
        "sap.lumira.geodata.filters.LayerFilterActions": [{}],
        "sap.lumira.geodata.filters.FilterUtils": [{}],
        "sap.lumira.geodata.listeners.LayerActions": [{}],
        "sap.lumira.geodata.listeners.MapActions": [{}],
        "sap.lumira.geodata.models.GeoModelDefaults": [{}],
        "sap.lumira.geodata.models.GeoModelHelper": [{}],
        "sap.lumira.geodata.models.LayerModel": [{}],
        "sap.lumira.geodata.models.MapModel": [{}],
        "sap.lumira.geodata.controllers.LayerController": [{}],
        "sap.lumira.geodata.controllers.MapController": [{}],
        "sap.lumira.geodata.constants.GeoConstants": [{}],
        "sap.lumira.geodata.constants.ScaleType": [{}],
        "sap.lumira.geodata.constants.DrillDirection": [{}],
        "sap.lumira.geodata.constants.LayerType": [{}],
        "sap.lumira.geodata.constants.BasemapType": [{}],
        "sap.lumira.geodata.constants.Contributions": [{}],
        "sap.lumira.geodata.constants.Events": [{}],
        "sap.lumira.geodata.scales.Scales": [{}],
        "sap.lumira.geodata.scales.ConstantScale": [{}],
        "sap.lumira.geodata.scales.DiscretePaletteScale": [{}],
        "sap.lumira.geodata.scales.GradientPaletteScale": [{}],
        "sap.lumira.geodata.scales.LinearScale": [{}],
        "sap.lumira.geodata.scales.QuantizedScale": [{}],
        "sap.lumira.geodata.scales.ThresholdScale": [{}],
        "sap.lumira.geodata.scales.OrdinalScale": [{}],
        "sap.lumira.geodata.scales.ScaleUtils": [{}],
        "sap.lumira.geodata.lib.Simplify": [{}],
        "sap.lumira.geodata.utils.GeospatialHelper": [{}],
        "sap.lumira.geodata.utils.GeoCalculationException": [{}],
        "sap.lumira.geodata.utils.GeoCacheUtils": [{}],
        "sap.lumira.geodata.utils.GeoDataFormatHelper": [{}],
        "sap.lumira.geodata.utils.GeoCalculationUtils": [{}],
        "sap.lumira.geodata.utils.GeoCopyPasteProvider": [{}],
        "sap.lumira.geodata.utils.GeoEnrichmentHelper": [{}],
        "sap.lumira.geodata.regions.RegionDataManager": [{}],
        "sap.lumira.geodata.regions.RegionDataModel": [{}],
        "sap.lumira.geodata.responsive.ResponsiveUIActionManager": [{}],
        "sap.lumira.geodata.responsive.ResponsiveUIActionModel": [{}],
        "sap.lumira.geodata.regions.RegionValidator": [{}],
        "sap.lumira.geoviz.controllers.MapVizController": [{}],
        "sap.lumira.geoviz.controllers.LayerVizController": [{}],
        "sap.lumira.geoviz.builder.GeoContentBuilder": [{}],
        "sap.lumira.geoviz.builder.GeoContentLayerBuilder": [{}],
        "sap.lumira.geoviz.builder.GeoContentBuilderLayerTypes": [{}],
        "sap.lumira.geoviz.layers.circle": [{}],
        "sap.lumira.geoviz.layers.poi": [{}],
        "sap.lumira.geoviz.layers.heatmap": [{}],
        "sap.lumira.geoviz.layers.polygon": [{}],
        "sap.lumira.geoviz.layers.feature": [{}],
        "sap.lumira.geoviz.layers.flow": [{}],
        "sap.lumira.geoviz.layers.baseLayer": [{}],
        "sap.lumira.geoviz.layers.ClusterGraphicsLayer": [{}],
        "sap.lumira.geoviz.layers.LabelLayer": [{}],
        "sap.lumira.geoviz.layers.SVGLayer": [{}],
        "sap.lumira.geoviz.layers.LayerLoader": [{}],
        "sap.lumira.geoviz.layers.Bindings": [{}],
        "sap.lumira.geoviz.legends.MapLegend": [{}],
        "sap.lumira.geoviz.legends.LayerContainer": [{}],
        "sap.lumira.geoviz.legends.LocationLegend": [{}],
        "sap.lumira.geoviz.legends.ColorLegend": [{}],
        "sap.lumira.geoviz.legends.SizeLegend": [{}],
        "sap.lumira.geoviz.legends.FlowLegend": [{}],
        "sap.lumira.geoviz.legends.MarkerLegend": [{}],
        "sap.lumira.geoviz.marker.MarkerCreationDialog": [{}],
        "sap.lumira.geoviz.marker.MarkerPicker": [{}],
        "sap.lumira.geoviz.marker.MarkerPickerDialog": [{}],
        "sap.lumira.geoviz.marker.MarkerType": [{}],
        "sap.lumira.geoviz.marker.MarkerWidget": [{}],
        "sap.lumira.geoviz.marker.MarkerValidator": [{}],
        "sap.lumira.geoviz.marker.MarkerValidatorType": [{}],
        "sap.lumira.geoviz.marker.UploadSVGDialog": [{}],
        "sap.lumira.geoviz.tools.PolygonDrawingTool": [{}],
        "sap.lumira.geoviz.tools.ZoomControls": [{}],
        "sap.lumira.geoviz.utils.GeometryHelper": [{}],
        "sap.lumira.geoviz.utils.CollisionDetector": [{}],
        "sap.lumira.geoviz.utils.OverlappingPointsIndicator": [{}],
        "sap.lumira.geoviz.utils.Utils": [{}],
        "sap.lumira.geoviz.map": [{}],
        "sap.lumira.geoviz.ESRIMap": [{}],
        "sap.lumira.geoviz.ESRIScale": [{}],
        "sap.lumira.geoviz.uimodels.MapUIModel": [{}],
        "sap.lumira.geoviz.labels.AbstractLabelCollection": [{}],
        "sap.lumira.geoviz.labels.DataLabelCollection": [{}],
        "sap.lumira.geoviz.labels.OverlappingLabelCollection": [{}],
        "sap.lumira.geoviz.labels.CompositeLabelCollection": [{}],
        "sap.lumira.geoviz.uimodels.LayerUIModel": [{}],
        "sap.lumira.geopanel.LayerUIController": [{}],
        "sap.lumira.geopanel.GeoPanelController": [{}],
        "sap.lumira.geopanel.MessageHelper": [{}],
        "sap.lumira.geopanel.UQMGeoControlsLoader": [{}],
        "sap.lumira.geopanel.MapFilterDialogFactory": [{}],
        "sap.lumira.geopanel.ui.Controls": [{}],
        "sap.lumira.geopanel.ui.UI5Controls": [{}],
        "sap.lumira.geopanel.ui.GeoFeedControlFactory": [{}],
        "sap.lumira.geopanel.ui.GeoHierarchyLevelSelector": [{}],
        "sap.lumira.geopanel.ui.GeoHierarchyTree": [{}],
        "sap.lumira.geopanel.ui.GeoHierarchyTreeNode": [{}],
        "sap.lumira.geopanel.ui.GeoPanel": [{}],
        "sap.lumira.geopanel.ui.GeoPanelWidgetUI": [{}],
        "sap.lumira.geopanel.ui.LayerUI": [{}],
        "sap.lumira.geopanel.ui.MapPropertiesUI": [{}],
        "sap.lumira.geopanel.ui.PolygonFilterUI": [{}],
        "sap.lumira.geopanel.ui.MapFilterUI": [{}],
        "sap.lumira.geopanel.ui.VersionFilterUI": [{}],
        "sap.lumira.geopanel.ui.DimensionFilterUI": [{}],
        "sap.lumira.geopanel.ui.MapExtentUI": [{}],
        "sap.lumira.geopanel.ui.HierarchyPanelControl": [{}],
        "sap.lumira.geopanel.ui.AbstractHierarchyFeedControl": [{}],
        "sap.lumira.geopanel.ui.DataPointFeedControl": [{}],
        "sap.lumira.geopanel.ui.HierarchyFeedControl": [{}],
        "sap.lumira.geopanel.ui.TooltipDisplayPanelControl": [{}],
        "sap.lumira.geopanel.ui.MoreActionsPanelControl": [{}],
        "sap.lumira.geopanel.Constants": [{}],
        "sap.lumira.geopanel.control.GeoContentPicker": [{}],
        "sap.lumira.geopanel.control.GeoTooltipObjectPicker": [{}],
        "sap.lumira.geopanel.control.GeoTooltipObjectPickerItem": [{}],
        "sap.lumira.geopanel.filters.ui.MapFilterDialogController": [{}],
        "sap.lumira.geopanel.filters.ui.MapFilterDialogView": [{}],
        "sap.lumira.geopanel.filters.ui.MapFilterDialogModel": [{}],
        "sap.lumira.geopanel.dialog.EditHierarchyLevelDialog": [{}],
        "sap.lumira.geopanel.slider.GeoRangeSlider": [{}],
        "sap.lumira.queryutils.MessageHelper": [{}],
        "sap.lumira.queryutils.QueryHelper": [{}],
        "sap.lumira.queryutils.QueryHelperFactory": [{}],
        "sap.lumira.queryutils.Utils": [{}],
        "sap.lumira.queryutils.VizFilterUtils": [{}],
        "sap.lumira.story.layout.unified.BoardroomHelper": [{}],
        "sap.lumira.story.layout.unified.GeoDomUpdateHelper": [{}],
        "sap.lumira.story.layout.unified.ViewtimeHelper": [{}],
        "sap.lumira.story.entity.responsiveDefaults": [{}],
        "sap.lumira.story.layout.reporting.ViewtimeHelper": [{}],
        "sap.lumira.vizbuilder.messageHelper": [{}],
        "sap.lumira.vizbuilder.control.ObjectPicker": [{}],
        "sap.lumira.vizbuilder.control.ChartTypePicker": [{}],
        "sap.lumira.vizbuilder.control.ChartTypeGroupPicker": [{}],
        "sap.lumira.vizbuilder.control.FeedPanel": [{}],
        "sap.lumira.vizbuilder.control.FeedColorScheme": [{}],
        "sap.lumira.vizbuilder.control.DatasetList": [{}],
        "sap.lumira.vizbuilder.control.DatasetSwitcher": [{}],
        "sap.lumira.vizbuilder.control.EditableDatasetSwitcher": [{}],
        "sap.lumira.vizbuilder.control.JoinTypeSwitcher": [{}],
        "sap.lumira.vizbuilder.control.VarianceBuilderPanel": [{}],
        "sap.lumira.vizbuilder.control.VarianceBuilderContainer": [{}],
        "sap.lumira.vizbuilder.control.ReferenceLinePanel": [{}],
        "sap.lumira.vizbuilder.control._ErrorBarForm": [{}],
        "sap.lumira.vizbuilder.control.ErrorBarPanel": [{}],
        "sap.lumira.vizbuilder.control._FeedListItem": [{}],
        "sap.lumira.vizbuilder.constants.Constants": [{}],
        "sap.lumira.vizbuilder.utils.VizBuilderEvents": [{}],
        "sap.lumira.vizbuilder.utils.ChartBuilderEvents": [{}],
        "sap.lumira.vizbuilder.constants.FeedItemIdType": [{}],
        "sap.lumira.vizbuilder.constants.FeedPanelConfiguration": [{}],
        "sap.lumira.vizbuilder.constants.DatasetDisabledState": [{}],
        "sap.lumira.vizbuilder.utils._feedDragValidator": [{}],
        "sap.lumira.vizbuilder.utils._utils": [{}],
        "sap.lumira.vizbuilder.utils.FeedUtils": [{}],
        "sap.lumira.vizbuilder.utils.FormattingUtils": [{}],
        "sap.lumira.vizbuilder.utils.SummaryDataset": [{}],
        "sap.lumira.vizbuilder.utils._SummaryQueryHelper": [{}],
        "sap.lumira.vizbuilder.utils.CustomCalcHelper": [{}],
        "sap.lumira.vizbuilder.model._VizBuilderFilter": [{}],
        "sap.lumira.vizbuilder.model._VizBuilderModel": [{}],
        "sap.lumira.vizbuilder.model._VizBuilderThresholdModel": [{}],
        "sap.lumira.vizbuilder.model.VizBuilderExceptionHandler": [{}],
        "sap.lumira.vizbuilder.vizdef.BindingEngine": [{}],
        "sap.lumira.vizbuilder.vizdef.ChartEngine": [{}],
        "sap.lumira.vizbuilder.vizdef._FpaChartHelper": [{}],
        "sap.lumira.vizbuilder.utils.WaterfallBindingHelper": [{}],
        "sap.lumira.vizbuilder.control.ReferenceLineFixedForm": [{}],
        "sap.lumira.vizbuilder.control.ReferenceLineDynamicForm": [{}],
        "sap.lumira.vizbuilder.control.CustomFeedItem": [{}],
        "sap.lumira.vizbuilder.control._DynamicReferenceLineFilter": [{}],
        "sap.lumira.vizbuilder.control._ReferenceLineVizBuilderAdapter": [{}],
        "sap.lumira.vizbuilder.control._BubbleStyling": [{}],
        "sap.lumira.vizbuilder.control._CategoryPatternList": [{}],
        "sap.lumira.vizbuilder.control._ColorByMeasureFeedListContent": [{}],
        "sap.lumira.vizbuilder.control.MeasuresMapHelper": [{}],
        "sap.lumira.vizbuilder.ContextContribution": [{}],
        "sap.lumira.vizbuilder.utils.VizSettingsUtils": [{}],
        "sap.lumira.vizbuilder.control.DatasetLinkOptionsMenuIcon": [{}],
        "sap.fpa.bi.thirdParty.slickGrid.ui5.SlickGrid": [{}],
        "sap.orca.da.plugin.bw.BWRequestManager": [{}],
        "sap.orca.da.plugin.bw.util.BWConstants": [{}],
        "sap.orca.da.plugin.bw.PresentationSelectionDialog.PresentationSelectionDialogFactory": [{}],
        "sap.orca.da.plugin.bw.hierarchySelectionDialog.HierarchySelectionDialogFactory": [{}],
        "sap.orca.da.plugin.bw.prompt.BWPromptDialogFactory": [{}],
        "sap.orca.da.ui.plugin.file.FileUiMetadata": [{}],
        "sap.orca.da.ui.plugin.file.FileService": [{}],
        "sap.orca.da.ui.plugin.googleDrive.GoogleDriveConnectionUiFactory": [{}],
        "sap.orca.da.ui.plugin.googleDrive.GoogleDriveUiFactory": [{}],
        "sap.orca.da.plugin.odata.ODataDataProvider": [{}],
        "sap.orca.da.plugin.odata.ODataHelper": [{}],
        "sap.orca.da.plugin.UiClient": [{}],
        "sap.orca.da.plugin.c4c.C4CUiMetadata": [{}],
        "sap.orca.da.plugin.c4c.C4CDataProvider": [{}],
        "sap.orca.da.plugin.c4c.C4CHelper": [{}],
        "sap.orca.da.plugin.c4canalytics.C4CAnalyticsUiMetadata": [{}],
        "sap.orca.da.plugin.c4canalytics.C4CAnalyticsDataProvider": [{}],
        "sap.orca.da.plugin.c4canalytics.C4CAnalyticsHelper": [{}],
        "sap.orca.da.plugin.cloudelements.CloudElementsHelper": [{}],
        "sap.orca.da.plugin.cloudelements.CloudElementsDataProvider": [{}],
        "sap.orca.da.plugin.cloudelements.CloudElementsInputValidationHelper": [{}],
        "sap.orca.da.plugin.jdbc.JDBCQueryInfo": [{}],
        "sap.orca.da.plugin.jdbc.VisualLinking.JDBCClientUIWrapper": [{}],
        "sap.orca.da.plugin.jdbc.VisualLinking.JDBCQueryBuilderScreen": [{}],
        "sap.orca.da.plugin.jdbc.VisualLinking.JDBCQueryNameScreen": [{}],
        "sap.orca.da.plugin.jdbc.VisualLinking.JDBCTableSelectionScreen": [{}],
        "sap.orca.da.plugin.jdbc.VisualLinking.JDBCVisualLinkingScreen": [{}],
        "sap.orca.dataExporter.DataExporterService": [{}],
        "sap.orca.dataExporter.DataExportManager": [{}],
        "sap.orca.dataExporter.DataExportManagerUQMWrapper": [{}],
        "sap.orca.dataExporter.ExportRequestFactory": [{}],
        "sap.orca.dataExporter.requests.HTTPExportRequest": [{}],
        "sap.orca.dataExporter.requests.RExportRequest": [{}],
        "sap.orca.dataExporter.requests.MultiHttpExportRequest": [{}],
        "sap.orca.dataExporter.requests.TableExportRequest": [{}],
        "sap.orca.dataExporter.requests.MultiTableExportRequest": [{}],
        "sap.orca.dataExporter.requests.StreamingExportRequest": [{}],
        "sap.orca.dataExporter.constants.FileType": [{}],
        "sap.orca.dataExporter.constants.ExportConstants": [{}],
        "sap.orca.dataExporter.constants.ExportType": [{}],
        "sap.orca.dataExporter.constants.QueryLimits": [{}],
        "sap.orca.dataExporter.constants.PDFQueryLimits": [{}],
        "sap.orca.dataExporter.constants.ExportDestinationType": [{}],
        "sap.orca.dataExporter.constants.JobType": [{}],
        "sap.orca.dataExporter.constants.TaskType": [{}],
        "sap.orca.dataExporter.constants.DataConstants": [{}],
        "sap.orca.dataExporter.constants.JobStatus": [{}],
        "sap.orca.dataExporter.constants.FireFlyConstants": [{}],
        "sap.orca.dataExporter.constants.FileSaverConstants": [{}],
        "sap.orca.dataExporter.constants.ExcelCreationConstants": [{}],
        "sap.orca.dataExporter.jobs.ExportJobFactory": [{}],
        "sap.orca.dataExporter.jobs.HTTPExportJob": [{}],
        "sap.orca.dataExporter.jobs.RExportJob": [{}],
        "sap.orca.dataExporter.jobs.TableExportJob": [{}],
        "sap.orca.dataExporter.jobs.MultiTableExportJob": [{}],
        "sap.orca.dataExporter.jobs.MultiHTTPExportJob": [{}],
        "sap.orca.dataExporter.jobs.StreamingExportJob": [{}],
        "sap.orca.dataExporter.tasks.ExportTaskFactory": [{}],
        "sap.orca.dataExporter.tasks.HTTPQueryExportTask": [{}],
        "sap.orca.dataExporter.tasks.PDFHTTPQueryExportTask": [{}],
        "sap.orca.dataExporter.tasks.DataParserTask": [{}],
        "sap.orca.dataExporter.tasks.DataParserRTask": [{}],
        "sap.orca.dataExporter.tasks.CSVGeneratorTask": [{}],
        "sap.orca.dataExporter.tasks.PDFTableGeneratorTask": [{}],
        "sap.orca.dataExporter.tasks.PDFMetadataGenerator": [{}],
        "sap.orca.dataExporter.tasks.PDFFilePersistenceTask": [{}],
        "sap.orca.dataExporter.tasks.CSVGeneratorRTask": [{}],
        "sap.orca.dataExporter.tasks.FilePersistenceTask": [{}],
        "sap.orca.dataExporter.tasks.MultiTableFilePersistenceTask": [{}],
        "sap.orca.dataExporter.tasks.FileStreamingPersistenceTask": [{}],
        "sap.orca.dataExporter.tasks.DataPersistenceTaskFactory": [{}],
        "sap.orca.dataExporter.ui.DataExportDialog": [{}],
        "sap.orca.dataExporter.utils.ExcelCreationUtils": [{}],
        "sap.orca.dataExporter.managers.ChartExportManager": [{}],
        "sap.orca.dataExporter.managers.TableExportManager": [{}],
        "sap.orca.pdfTable.Document": [{}],
        "sap.orca.pdfTable.Page": [{}],
        "sap.orca.pdfTable.PDFTable": [{}],
        "sap.orca.pdfTable.PDFTableConstants": [{}],
        "sap.orca.pdfTable.PDFTableDefaults": [{}],
        "sap.orca.pdfTable.PDFTableTypes": [{}],
        "sap.orca.pdfTable.TableLayout": [{}],
        "sap.orca.pdfTable.TableMetrics": [{}],
        "sap.orca.pdfTable.TableUtils": [{}],
        "sap.fpa.bi.pinDataPoint.PinDataPointService": [{}],
        "sap.fpa.bi.pinDataPoint.PinDataPointServiceFactory": [{}],
        "sap.fpa.bi.pinDataPoint.PinnedDataPointsConstants": [{}],
        "sap.fpa.bi.pinDataPoint.PinDataPointUtils": [{}],
        "sap.fpa.bi.pinDataPoint._PinnedDataPointsModel": [{}],
        "sap.fpa.bi.chartOrchestration.OrchestrationService": [{}],
        "sap.fpa.bi.chartOrchestration.OrchestrationServiceFactory": [{}],
        "sap.epm.appBuilding.panel.MessageHelper": [{}],
        "sap.epm.appBuilding.panel.AppBuildingPanel": [{}],
        "sap.epm.appBuilding.panel.ImageValueSection": [{}],
        "sap.epm.appBuilding.panel.ValueSection": [{}],
        "sap.epm.appBuilding.panel.popupValueSection": [{}],
        "sap.epm.appBuilding.panel.sliderManualValueSection": [{}],
        "sap.epm.appBuilding.panel.rangeSliderManualValueSection": [{}],
        "sap.epm.appBuilding.panel.sliderValueSection": [{}],
        "sap.epm.appBuilding.panel.sliderPropertySection": [{}],
        "sap.epm.appBuilding.panel.rangeSliderValueSection": [{}],
        "sap.epm.appBuilding.panel.rangeSliderPropertySection": [{}],
        "sap.epm.appBuilding.panel.TabstripValueSection": [{}],
        "sap.epm.appBuilding.panel.binding.SelectableWidgetValueSection": [{}],
        "sap.epm.appBuilding.panel.picker.GlobalVariablePicker": [{}],
        "sap.epm.appBuilding.panel.picker.ModelVariablePicker": [{}],
        "sap.epm.appBuilding.panel.picker.TileVariablePicker": [{}],
        "sap.epm.appBuilding.panel.picker.ApplicationPropertyPicker": [{}],
        "sap.epm.appBuilding.panel.HintTextValueSection": [{}],
        "sap.epm.appBuilding.panel.InputValueSection": [{}],
        "sap.epm.appBuilding.panel.SwitchValueSection": [{}]
    };
    c.ui5ModMap = new Map,
    c.serviceMetadata = function(e) {
        if (e) {
            if ("*" === e[0])
                return f[e.substr(1)];
            if (f[e]) {
                var a = f[e];
                return a[a.length - 1]
            }
        }
    }
    ,
    c.LocUtil = (a = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?(-[0-9A-Z]{5,8}|(?:[0-9][0-9A-Z]{3}))*(?:-([0-9A-WYZ](?:-[0-9A-Z]{2,8})+))*(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i,
    t = /-(saptrc|sappsd)(?:-|$)/i,
    r = {
        yi: "ji",
        sr: "sh"
    },
    i = "en",
    {
        normalize: function(e) {
            var i;
            if ("string" == typeof e && (i = a.exec(e.replace(/_/g, "-")))) {
                var o = i[1].toLowerCase();
                o = r[o] || o;
                var n = i[2] ? i[2].toLowerCase() : void 0
                  , s = i[3] ? i[3].toUpperCase() : void 0
                  , p = i[4]
                  , l = i[6];
                return l && (i = t.exec(l)) || p && (i = t.exec(p)) ? "en_US_" + i[1].toLowerCase() : ("zh" !== o || s || ("hans" === n ? s = "CN" : "hant" !== n || (s = "TW")),
                o + (s ? "_" + s + (p ? "_" + p.slice(1).replace("-", "_") : "") : ""))
            }
        },
        getAppLocale: function() {
            return i
        },
        setAppLocale: function(e) {
            i = e
        },
        getAppInitialNormalizedLocale: function() {
            return this._initialNormalizedLocale || (this._initialNormalizedLocale = this.normalize(this.getAppLocale())),
            this._initialNormalizedLocale
        }
    }),
    c.ic = {
        0: 0
    },
    c.workerChunkUrl = function(e) {
        if (orca.buildManifest && orca.buildManifest.workerAssets) {
            let t = orca.buildManifest.workerAssets;
            var a = t[e];
            if (!a)
                throw Error("require.workerChunkUrl: no worker chunk with name: '" + e + "'. The following are available: " + Object.keys(t));
            return c.p + a
        }
    }
    ,
    o = {
        674: 1
    },
    c.f.i = function(e, a) {
        o[e] || importScripts(c.p + c.u(e))
    }
    ,
    s = (n = self.webpackChunksap_orca = self.webpackChunksap_orca || []).push.bind(n),
    n.push = function(e) {
        var [a,t,r] = e;
        for (var i in t)
            c.o(t, i) && (c.m[i] = t[i]);
        for (r && r(c); a.length; )
            o[a.pop()] = 1;
        s(e)
    }
    ,
    p = c.x,
    c.x = function() {
        return c.e(89).then(p)
    }
    ,
    c.x()
}();
