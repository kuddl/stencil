import { BuildConfig, Diagnostic } from '../interfaces';
import { escapeHtml, prepareLines } from './logger-util';
import { highlightError } from './highlight/highlight';
import { toTitleCase } from '../../util/helpers';


export function generateHtmlDiagnostics(config: BuildConfig, diagnostics: Diagnostic[]) {
  // TODO
  config;
  diagnostics;
  generateHtmlDocument;
}


function generateHtmlDocument(diagnostics: Diagnostic[]) {
  return `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
 <meta charset="utf-8">
 <title>Dev Diagnostics</title>
 <style>${appendCss()}</style>
</head>
<body id="dev-diagnostics">

${diagnostics.map(generateDiagnosticHtml).join('\n\n')}

<script>${appendJs()}</script>

</body>
</html>`;
}


function generateDiagnosticHtml(d: Diagnostic) {
  const c: string[] = [];

  c.push(`<div class="dev-diagnostic">`);

  c.push(` <div class="dev-diagnostic-masthead" title="${escapeHtml(d.type)} error: ${escapeHtml(d.code)}">`);

  const title = `${toTitleCase(d.type)} ${toTitleCase(d.level)}`;
  c.push(`  <div class="dev-diagnostic-title">${escapeHtml(title)}</div>`);

  c.push(`  <div class="dev-diagnostic-message" data-error-code="${escapeHtml(d.type)}-${escapeHtml(d.code)}">${escapeHtml(d.messageText)}</div>`);

  c.push(` </div>`); // .dev-diagnostic-masthead

  c.push(generateCodeBlock(d));

  c.push(`</div>`); // .dev-diagnostic

  return c.join('\n');
}


function generateCodeBlock(d: Diagnostic) {
  if (!d.relFilePath && (!d.lines || !d.lines.length)) {
    return '';
  }

  const c: string[] = [];

  c.push(` <div class="dev-diagnostic-file">`);

  if (d.relFilePath) {
    c.push(`  <div class="dev-diagnostic-file-header"${escapeHtml(d.absFilePath)}">${escapeHtml(d.relFilePath)}</div>`);
  }

  if (d.lines && d.lines.length) {
    c.push(`  <div class="dev-diagnostic-blob">`);

    c.push(`   <table class="dev-diagnostic-table">`);

    prepareLines(d.lines, 'html').forEach(l => {
      c.push(`    <tr${(l.errorCharStart > -1) ? ' class="dev-diagnostic-error-line"' : ''}>`);

      c.push(`     <td class="dev-diagnostic-blob-num" data-line-number="${l.lineNumber}"></td>`);

      c.push(`     <td class="dev-diagnostic-blob-code">${highlightError(l.html, l.errorCharStart, l.errorLength)}</td>`);

      c.push(`    </tr>`);
    });

    c.push(`   </table>`);

    c.push(`  </div>`); // .dev-diagnostic-blob
  }

  c.push(` </div>`); // .dev-diagnostic-file

  return c.join('\n');
}


function appendCss() {
  // inlining everything to keep the dev server simple
  return `
    a,
    button {
        -ms-touch-action: manipulation;
        touch-action: manipulation
    }
    #dev-diagnostics * {
        box-sizing: border-box
    }
    #dev-diagnostics {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100000;
        margin: 0;
        padding: 0;
        font-family: -apple-system, "Roboto", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 14px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        text-size-adjust: none;
        word-wrap: break-word;
        color: #333;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
        user-select: auto
    }
    body#dev-diagnostics {
      overflow: auto;
    }
    .dev-diagnostics-content {
        position: relative;
        padding: 0 0 30px 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch
    }
    #dev-diagnostics .dev-diagnostic {
        margin: 20px;
        border: 1px solid #ddd;
        border-radius: 3px
    }
    #dev-diagnostics .dev-diagnostic-masthead {
        padding: 8px 12px 12px 12px
    }
    #dev-diagnostics .dev-diagnostic-title {
        margin: 0;
        font-size: 16px;
        color: #222
    }
    #dev-diagnostics .dev-diagnostic-message {
        margin-top: 4px;
        color: #666
    }
    #dev-diagnostics .dev-diagnostic-file {
        position: relative;
        border-top: 1px solid #ddd
    }
    #dev-diagnostics .dev-diagnostic-file-header {
        padding: 5px 10px;
        border-bottom: 1px solid #ddd;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        background-color: #f8f8f8
    }
    #dev-diagnostics {
        -webkit-transition: opacity 150ms ease-out;
        transition: opacity 150ms ease-out
    }
    #dev-diagnostics.dev-diagnostics-fade-out {
        opacity: 0
    }
    #dev-diagnostics .dev-diagnostic-blob {
        overflow-x: auto;
        overflow-y: hidden;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px
    }
    #dev-diagnostics .dev-diagnostic-table {
        border-spacing: 0;
        border-collapse: collapse;
        -moz-tab-size: 2;
        tab-size: 2
    }
    #dev-diagnostics .dev-diagnostic-table td,
    #dev-diagnostics .dev-diagnostic-table th {
        padding: 0
    }
    #dev-diagnostics td.dev-diagnostic-blob-num {
        padding-right: 10px;
        padding-left: 10px;
        width: 1%;
        min-width: 50px;
        font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.3);
        text-align: right;
        white-space: nowrap;
        vertical-align: top;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: solid #eee;
        border-width: 0 1px 0 0
    }
    #dev-diagnostics .dev-diagnostic-blob-num::before {
        content: attr(data-line-number)
    }
    #dev-diagnostics .dev-diagnostic-error-line .dev-diagnostic-blob-num {
        background-color: #fdd;
        border-color: #ffc9c9
    }
    #dev-diagnostics .dev-diagnostic-error-line .dev-diagnostic-blob-code {
        background: rgba(255, 221, 221, 0.25);
        z-index: -1
    }
    #dev-diagnostics .dev-diagnostics-error-chr {
        position: relative
    }
    #dev-diagnostics .dev-diagnostics-error-chr::before {
        position: absolute;
        z-index: -1;
        top: -3px;
        left: 0px;
        width: 8px;
        height: 20px;
        background-color: #fdd;
        content: ""
    }
    #dev-diagnostics td.dev-diagnostic-blob-code {
        position: relative;
        padding-right: 10px;
        padding-left: 10px;
        line-height: 20px;
        vertical-align: top;
        overflow: visible;
        font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 12px;
        color: #333;
        word-wrap: normal;
        white-space: pre
    }
    #dev-diagnostics .dev-diagnostic-blob-code::before {
        content: ""
    }
    #dev-diagnostics .dev-diagnostic-stack-header {
        padding: 5px 10px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #f8f8f8
    }
    #dev-diagnostics .dev-diagnostic-stack {
        font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 10px;
        color: #333;
        word-wrap: normal;
        white-space: pre;
        overflow: auto;
        padding: 10px;
        user-select: auto;
        -webkit-user-select: text
    }
    #dev-diagnostics-toast {
        position: absolute;
        top: 10px;
        right: 10px;
        left: 10px;
        z-index: 100002;
        margin: auto;
        max-width: 700px;
        border-radius: 3px;
        font-family: -apple-system, "Roboto", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.9);
        -webkit-transform: translate3d(0px, -60px, 0px);
        transform: translate3d(0px, -60px, 0px);
        -webkit-transition: -webkit-transform 75ms ease-out;
        transition: transform 75ms ease-out;
        pointer-events: none
    }
    #dev-diagnostics-toast.dev-diagnostics-toast-active {
        -webkit-transform: translate3d(0px, 0px, 0px);
        transform: translate3d(0px, 0px, 0px)
    }
    #dev-diagnostics-toast .dev-diagnostics-toast-content {
        display: flex;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        pointer-events: auto
    }
    #dev-diagnostics-toast .dev-diagnostics-toast-message {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        padding: 15px;
        font-family: -apple-system, "Roboto", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 14px;
        color: #fff
    }
    #dev-diagnostics-toast .dev-diagnostics-toast-spinner {
        position: relative;
        display: inline-block;
        width: 56px;
        height: 28px
    }
    #dev-diagnostics-toast svg:not(:root) {
        overflow: hidden
    }
    #dev-diagnostics-toast svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: dev-diagnostics-spinner-rotate 600ms linear infinite;
        animation: dev-diagnostics-spinner-rotate 600ms linear infinite
    }
    @-webkit-keyframes dev-diagnostics-spinner-rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }
    @keyframes dev-diagnostics-spinner-rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }
    #dev-diagnostics-toast svg circle {
        fill: transparent;
        stroke: white;
        stroke-width: 4px;
        stroke-dasharray: 128px;
        stroke-dashoffset: 82px
    }
    .dev-diagnostics-header {
        background: #f8f8f8;
        border-bottom: .55px solid #ddd;
        color: #333
    }
    .dev-diagnostics-cordova-ios .dev-diagnostics-header {
        padding-top: 20px
    }
    .dev-diagnostics-header-content {
        display: -webkit-flex;
        display: flex;
        overflow: hidden;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        width: 100%;
        min-height: 44px
    }
    .dev-diagnostics-header-inner {
        -webkit-flex: 1;
        flex: 1;
        display: -webkit-flex;
        display: flex;
        padding: 0 20px;
        font-size: 20px
    }
    .dev-diagnostics-buttons {
        display: -webkit-flex;
        display: flex;
        padding: 0 0 0 20px
    }
    #dev-diagnostic-close {
        margin: 0;
        padding: 10px 20px;
        border: 0;
        outline: none;
        background: transparent;
        font-size: 14px;
        color: #478aff;
        -moz-appearance: none;
        -ms-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer
    }
    #dev-diagnostic-close:hover {
        opacity: 0.7
    }
    #dev-diagnostics-options {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100001;
        width: 100%;
        height: 100%;
        font-family: -apple-system, "Roboto", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
    }
    .dev-diagnostics-sheet-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
        display: block;
        margin: auto;
        width: 100%;
        max-width: 500px;
        transition: transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
        transform: translate3d(0, 100%, 0)
    }
    #dev-diagnostics-backdrop {
        width: 100%;
        height: 100%;
        opacity: 0.01;
        background: black;
        transition: opacity 300ms cubic-bezier(0.36, 0.66, 0.04, 1)
    }
    .dev-diagnostics-options-show .dev-diagnostics-sheet-wrapper {
        transform: translate3d(0, 0, 0)
    }
    .dev-diagnostics-options-show #dev-diagnostics-backdrop {
        opacity: 0.4
    }
    .dev-diagnostics-sheet-container {
        padding: 0 10px
    }
    .dev-diagnostics-sheet-group {
        overflow: hidden;
        margin-bottom: 8px;
        border-radius: 13px;
        background: #f9f9f9
    }
    .dev-diagnostics-sheet-group:last-child {
        margin-bottom: 10px
    }
    .dev-diagnostics-sheet-title {
        padding: 15px;
        border-bottom: .55px solid #d6d6da;
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        color: #8f8f8f
    }
    .dev-diagnostics-sheet-button {
        margin: 0;
        padding: 18px;
        width: 100%;
        min-height: 56px;
        border-bottom: .55px solid #d6d6da;
        font-size: 20px;
        color: #478aff;
        background: transparent
    }
    .dev-diagnostics-sheet-button:last-child {
        border-bottom: 0
    }
    #dev-diagnostics-system-info {
        margin: 0 20px 20px 20px;
        padding: 0px 0 20px 0;
        font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 10px;
        color: #999;
        overflow: auto;
        white-space: pre
    }

    /**
     * GitHub Gist Theme
     * Author : Louis Barranqueiro - https://github.com/LouisBarranqueiro
     * https://highlightjs.org/
     */

    .hljs-comment,
    .hljs-meta {
        color: #969896
    }
    .hljs-string,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-strong,
    .hljs-emphasis,
    .hljs-quote {
        color: #df5000
    }
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-type {
        color: #a71d5d
    }
    .hljs-literal,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-attribute {
        color: #0086b3
    }
    .hljs-section,
    .hljs-name {
        color: #63a35c
    }
    .hljs-tag {
        color: #333333
    }
    .hljs-title,
    .hljs-attr,
    .hljs-selector-id,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo {
        color: #795da3
    }
    .hljs-addition {
        color: #55a532;
        background-color: #eaffea
    }
    .hljs-deletion {
        color: #bd2c00;
        background-color: #ffecec
    }
    .hljs-link {
        text-decoration: underline
    }
  `;
}


function appendJs() {
  return `
  console.log('dev diagnostics');
  `;
}
