import { text, image, barcodes } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";

export const PrintEndofDay = (data: any) => {

  async function RunIt(data: any) {
    const template = {
      "schemas": [
        {
          "dateNow": {
            "type": "text",
            "content": "June 2 2024",
            "position": {
              "x": 39.69,
              "y": 21.17
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "dept": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 39.9,
              "y": 27.47
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "subTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.05,
              "y": 51.63
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "tax": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.15,
              "y": 57.91
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "total": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.18,
              "y": 65.43
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 16,
            "lineHeight": 1
          },
          "cashTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.08,
              "y": 90.57
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "debitTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.18,
              "y": 96.85
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "creditTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.11,
              "y": 103.88
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "chequeTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.21,
              "y": 110.16
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "onlineTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.14,
              "y": 118.01
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "eTransferTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.24,
              "y": 124.29
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "visaTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.24,
              "y": 147.45
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "mastercardTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.17,
              "y": 155.3
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "amexTotal": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.27,
              "y": 161.58
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "sales1": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40,
              "y": 184.31
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "salesTotal1": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.03,
              "y": 184.4
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "sales2": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.03,
              "y": 191
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "salesTotal2": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.06,
              "y": 191.09
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "sales3": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40,
              "y": 198.03
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "salesTotal3": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.03,
              "y": 198.12
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1
          },
          "sales4": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.03,
              "y": 204.72
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal4": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.06,
              "y": 204.81
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales5": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.03,
              "y": 211.26
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal5": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.06,
              "y": 211.35
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales6": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.06,
              "y": 217.95
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal6": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.09,
              "y": 218.04
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,

          },
          "sales7": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.03,
              "y": 224.98
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,

          },
          "salesTotal7": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.06,
              "y": 225.07
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales8": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.06,
              "y": 231.67
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal8": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.09,
              "y": 231.76
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales9": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.06,
              "y": 238.29
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal9": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.09,
              "y": 238.38
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales10": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.03,
              "y": 245.32
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal10": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.06,
              "y": 245.41
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "sales11": {
            "type": "text",
            "content": "Sales",
            "position": {
              "x": 40.06,
              "y": 252.01
            },
            "width": 69.87,
            "height": 5.5,
            "alignment": "left",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          },
          "salesTotal11": {
            "type": "text",
            "content": "100.84",
            "position": {
              "x": 110.09,
              "y": 252.1
            },
            "width": 69.87,
            "height": 5.5,

            "alignment": "right",
            "verticalAlignment": "top",
            "fontSize": 12,
            "lineHeight": 1,
          }
        }
      ],
      "basePdf": "data:application/pdf;base64,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NTYgMzMzIDI3NyA2NjYKMjIyIDUwMCA1NTYgODMzIDU1NiA2MTAgNTAwIDY2NiAyMjIgNzIyIDU1NiA1NTYgNzc3IDUwMCAzMzMgNjY2CjUwMCA3MjIgNjY2IDgzMyA2NjYgNjY2IF0KL0ZvbnREZXNjcmlwdG9yIDEzMCAwIFIKL1RvVW5pY29kZSAxMzEgMCBSCj4+CmVuZG9iagoKMTMzIDAgb2JqCjw8L0YxIDEzMiAwIFIKPj4KZW5kb2JqCgoxMzQgMCBvYmoKPDwvRm9udCAxMzMgMCBSCi9Qcm9jU2V0Wy9QREYvVGV4dF0KPj4KZW5kb2JqCgoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMTI3IDAgUi9SZXNvdXJjZXMgMTM0IDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vU3RydWN0UGFyZW50cyAwCi9Db250ZW50cyAyIDAgUj4+CmVuZG9iagoKMTM1IDAgb2JqCjw8L0NvdW50IDEvRmlyc3QgMTM2IDAgUi9MYXN0IDEzNiAwIFIKPj4KZW5kb2JqCgoxMzYgMCBvYmoKPDwvQ291bnQgMC9UaXRsZTxGRUZGMDA1MDAwNjEwMDY3MDA2NTAwMjAwMDMxPgovRGVzdFsxIDAgUi9YWVogMCA3OTIgMF0vUGFyZW50IDEzNSAwIFI+PgplbmRvYmoKCjEzNyAwIG9iago8PC9UeXBlL01ldGFkYXRhL1N1YnR5cGUvWE1ML0xlbmd0aCA0OTA0Pj4Kc3RyZWFtCjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwZGZ1YWlkPSJodHRwOi8vd3d3LmFpaW0ub3JnL3BkZnVhL25zL2lkLyI+CiAgIDxwZGZ1YWlkOnBhcnQ+MTwvcGRmdWFpZDpwYXJ0PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBkZj0iaHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyI+CiAgIDxwZGY6UHJvZHVjZXI+TGlicmVPZmZpY2UgNy41PC9wZGY6UHJvZHVjZXI+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgPHhtcDpDcmVhdG9yVG9vbD5EcmF3PC94bXA6Q3JlYXRvclRvb2w+CiAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDI0LTA4LTE2VDE2OjU3OjQ5LTA0OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4KCmVuZHN0cmVhbQplbmRvYmoKCjcgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNiAwIFIKL1BnIDEgMCBSCi9LWzEgXQo+PgplbmRvYmoKCjEzOSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjE0MCAwIG9iago8PC9PL1RhYmxlCi9TY29wZS9Db2x1bW4KPj4KZW5kb2JqCgo2IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9USAovUCA1IDAgUgovUGcgMSAwIFIKL0EgWyAxMzkgMCBSIDE0MCAwIFIgXQovS1swIDcgMCBSIF0KPj4KZW5kb2JqCgo5IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE0MSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjE0MiAwIG9iago8PC9PL1RhYmxlCi9TY29wZS9Db2x1bW4KPj4KZW5kb2JqCgo4IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9USAovUCA1IDAgUgovUGcgMSAwIFIKL0EgWyAxNDEgMCBSIDE0MiAwIFIgXQovS1syIDkgMCBSIF0KPj4KZW5kb2JqCgoxNDMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjUgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNDMgMCBSCi9LWzYgMCBSIDggMCBSIF0KPj4KZW5kb2JqCgoxMiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxMSAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTQ0IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTEgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDEwIDAgUgovUGcgMSAwIFIKL0EgMTQ0IDAgUgovS1szIDEyIDAgUiBdCj4+CmVuZG9iagoKMTQgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgMTMgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE0NSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjEzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMCAwIFIKL1BnIDEgMCBSCi9BIDE0NSAwIFIKL0tbNCAxNCAwIFIgXQo+PgplbmRvYmoKCjE0NiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMTAgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNDYgMCBSCi9LWzExIDAgUiAxMyAwIFIgXQo+PgplbmRvYmoKCjE3IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDE2IDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxNDcgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoxNiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgMTUgMCBSCi9QZyAxIDAgUgovQSAxNDcgMCBSCi9LWzUgMTcgMCBSIF0KPj4KZW5kb2JqCgoxOSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxOCAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTQ4IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTggMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDE1IDAgUgovUGcgMSAwIFIKL0EgMTQ4IDAgUgovS1s2IDE5IDAgUiBdCj4+CmVuZG9iagoKMTQ5IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvQmxvY2sKPj4KZW5kb2JqCgoxNSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDE0OSAwIFIKL0tbMTYgMCBSIDE4IDAgUiBdCj4+CmVuZG9iagoKMjIgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgMjEgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE1MCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjIxIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAyMCAwIFIKL1BnIDEgMCBSCi9BIDE1MCAwIFIKL0tbNyAyMiAwIFIgXQo+PgplbmRvYmoKCjI0IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDIzIDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxNTEgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoyMyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgMjAgMCBSCi9QZyAxIDAgUgovQSAxNTEgMCBSCi9LWzggMjQgMCBSIF0KPj4KZW5kb2JqCgoxNTIgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjIwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTUyIDAgUgovS1syMSAwIFIgMjMgMCBSIF0KPj4KZW5kb2JqCgoyNyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAyNiAwIFIKL1BnIDEgMCBSCi9LWzEwIF0KPj4KZW5kb2JqCgoxNTMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoyNiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgMjUgMCBSCi9QZyAxIDAgUgovQSAxNTMgMCBSCi9LWzkgMjcgMCBSIF0KPj4KZW5kb2JqCgoyOSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAyOCAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTU0IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMjggMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDI1IDAgUgovUGcgMSAwIFIKL0EgMTU0IDAgUgovS1sxMSAyOSAwIFIgXQo+PgplbmRvYmoKCjE1NSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMjUgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNTUgMCBSCi9LWzI2IDAgUiAyOCAwIFIgXQo+PgplbmRvYmoKCjMyIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDMxIDAgUgovUGcgMSAwIFIKL0tbMTMgXQo+PgplbmRvYmoKCjE1NiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjMxIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAzMCAwIFIKL1BnIDEgMCBSCi9BIDE1NiAwIFIKL0tbMTIgMzIgMCBSIF0KPj4KZW5kb2JqCgozNCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAzMyAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTU3IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMzMgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDMwIDAgUgovUGcgMSAwIFIKL0EgMTU3IDAgUgovS1sxNCAzNCAwIFIgXQo+PgplbmRvYmoKCjE1OCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMzAgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNTggMCBSCi9LWzMxIDAgUiAzMyAwIFIgXQo+PgplbmRvYmoKCjM3IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDM2IDAgUgovUGcgMSAwIFIKL0tbMTYgXQo+PgplbmRvYmoKCjE1OSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjM2IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAzNSAwIFIKL1BnIDEgMCBSCi9BIDE1OSAwIFIKL0tbMTUgMzcgMCBSIF0KPj4KZW5kb2JqCgozOSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAzOCAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTYwIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMzggMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDM1IDAgUgovUGcgMSAwIFIKL0EgMTYwIDAgUgovS1sxNyAzOSAwIFIgXQo+PgplbmRvYmoKCjE2MSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMzUgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNjEgMCBSCi9LWzM2IDAgUiAzOCAwIFIgXQo+PgplbmRvYmoKCjQyIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDQxIDAgUgovUGcgMSAwIFIKL0tbMTkgXQo+PgplbmRvYmoKCjE2MiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjQxIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA0MCAwIFIKL1BnIDEgMCBSCi9BIDE2MiAwIFIKL0tbMTggNDIgMCBSIF0KPj4KZW5kb2JqCgo0NCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA0MyAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTYzIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKNDMgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDQwIDAgUgovUGcgMSAwIFIKL0EgMTYzIDAgUgovS1syMCA0NCAwIFIgXQo+PgplbmRvYmoKCjE2NCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKNDAgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RSCi9QIDQgMCBSCi9QZyAxIDAgUgovQSAxNjQgMCBSCi9LWzQxIDAgUiA0MyAwIFIgXQo+PgplbmRvYmoKCjQ3IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDQ2IDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxNjUgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo0NiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNDUgMCBSCi9QZyAxIDAgUgovQSAxNjUgMCBSCi9LWzIxIDQ3IDAgUiBdCj4+CmVuZG9iagoKNDkgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNDggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE2NiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjQ4IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA0NSAwIFIKL1BnIDEgMCBSCi9BIDE2NiAwIFIKL0tbMjIgNDkgMCBSIF0KPj4KZW5kb2JqCgoxNjcgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjQ1IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTY3IDAgUgovS1s0NiAwIFIgNDggMCBSIF0KPj4KZW5kb2JqCgo1MiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA1MSAwIFIKL1BnIDEgMCBSCi9LWzI0IF0KPj4KZW5kb2JqCgoxNjggMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo1MSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNTAgMCBSCi9QZyAxIDAgUgovQSAxNjggMCBSCi9LWzIzIDUyIDAgUiBdCj4+CmVuZG9iagoKNTQgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNTMgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE2OSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjUzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA1MCAwIFIKL1BnIDEgMCBSCi9BIDE2OSAwIFIKL0tbMjUgNTQgMCBSIF0KPj4KZW5kb2JqCgoxNzAgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjUwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTcwIDAgUgovS1s1MSAwIFIgNTMgMCBSIF0KPj4KZW5kb2JqCgo1NyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA1NiAwIFIKL1BnIDEgMCBSCi9LWzI3IF0KPj4KZW5kb2JqCgoxNzEgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo1NiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNTUgMCBSCi9QZyAxIDAgUgovQSAxNzEgMCBSCi9LWzI2IDU3IDAgUiBdCj4+CmVuZG9iagoKNTkgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNTggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE3MiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjU4IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA1NSAwIFIKL1BnIDEgMCBSCi9BIDE3MiAwIFIKL0tbMjggNTkgMCBSIF0KPj4KZW5kb2JqCgoxNzMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjU1IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTczIDAgUgovS1s1NiAwIFIgNTggMCBSIF0KPj4KZW5kb2JqCgo2MiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA2MSAwIFIKL1BnIDEgMCBSCi9LWzMwIF0KPj4KZW5kb2JqCgoxNzQgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo2MSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNjAgMCBSCi9QZyAxIDAgUgovQSAxNzQgMCBSCi9LWzI5IDYyIDAgUiBdCj4+CmVuZG9iagoKNjQgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNjMgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE3NSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjYzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA2MCAwIFIKL1BnIDEgMCBSCi9BIDE3NSAwIFIKL0tbMzEgNjQgMCBSIF0KPj4KZW5kb2JqCgoxNzYgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjYwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTc2IDAgUgovS1s2MSAwIFIgNjMgMCBSIF0KPj4KZW5kb2JqCgo2NyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA2NiAwIFIKL1BnIDEgMCBSCi9LWzMzIF0KPj4KZW5kb2JqCgoxNzcgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo2NiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNjUgMCBSCi9QZyAxIDAgUgovQSAxNzcgMCBSCi9LWzMyIDY3IDAgUiBdCj4+CmVuZG9iagoKNjkgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNjggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE3OCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjY4IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA2NSAwIFIKL1BnIDEgMCBSCi9BIDE3OCAwIFIKL0tbMzQgNjkgMCBSIF0KPj4KZW5kb2JqCgoxNzkgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjY1IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTc5IDAgUgovS1s2NiAwIFIgNjggMCBSIF0KPj4KZW5kb2JqCgo3MiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA3MSAwIFIKL1BnIDEgMCBSCi9LWzM2IF0KPj4KZW5kb2JqCgoxODAgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo3MSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNzAgMCBSCi9QZyAxIDAgUgovQSAxODAgMCBSCi9LWzM1IDcyIDAgUiBdCj4+CmVuZG9iagoKNzQgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNzMgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE4MSAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjczIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA3MCAwIFIKL1BnIDEgMCBSCi9BIDE4MSAwIFIKL0tbMzcgNzQgMCBSIF0KPj4KZW5kb2JqCgoxODIgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjcwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTgyIDAgUgovS1s3MSAwIFIgNzMgMCBSIF0KPj4KZW5kb2JqCgo3NyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA3NiAwIFIKL1BnIDEgMCBSCi9LWzM5IF0KPj4KZW5kb2JqCgoxODMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo3NiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgNzUgMCBSCi9QZyAxIDAgUgovQSAxODMgMCBSCi9LWzM4IDc3IDAgUiBdCj4+CmVuZG9iagoKNzkgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgNzggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE4NCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjc4IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA3NSAwIFIKL1BnIDEgMCBSCi9BIDE4NCAwIFIKL0tbNDAgNzkgMCBSIF0KPj4KZW5kb2JqCgoxODUgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjc1IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTg1IDAgUgovS1s3NiAwIFIgNzggMCBSIF0KPj4KZW5kb2JqCgo4MiAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA4MSAwIFIKL1BnIDEgMCBSCi9LWzQyIF0KPj4KZW5kb2JqCgoxODYgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo4MSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgODAgMCBSCi9QZyAxIDAgUgovQSAxODYgMCBSCi9LWzQxIDgyIDAgUiBdCj4+CmVuZG9iagoKODQgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgODMgMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjE4NyAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjgzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCA4MCAwIFIKL1BnIDEgMCBSCi9BIDE4NyAwIFIKL0tbNDMgODQgMCBSIF0KPj4KZW5kb2JqCgoxODggMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjgwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMTg4IDAgUgovS1s4MSAwIFIgODMgMCBSIF0KPj4KZW5kb2JqCgo4NyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCA4NiAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTg5IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKODYgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDg1IDAgUgovUGcgMSAwIFIKL0EgMTg5IDAgUgovS1s0NCA4NyAwIFIgXQo+PgplbmRvYmoKCjg5IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDg4IDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxOTAgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo4OCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgODUgMCBSCi9QZyAxIDAgUgovQSAxOTAgMCBSCi9LWzQ1IDg5IDAgUiBdCj4+CmVuZG9iagoKMTkxIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvQmxvY2sKPj4KZW5kb2JqCgo4NSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDE5MSAwIFIKL0tbODYgMCBSIDg4IDAgUiBdCj4+CmVuZG9iagoKOTIgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgOTEgMCBSCi9QZyAxIDAgUgovS1s0NyBdCj4+CmVuZG9iagoKMTkyIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKOTEgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDkwIDAgUgovUGcgMSAwIFIKL0EgMTkyIDAgUgovS1s0NiA5MiAwIFIgXQo+PgplbmRvYmoKCjk0IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDkzIDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxOTMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo5MyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgOTAgMCBSCi9QZyAxIDAgUgovQSAxOTMgMCBSCi9LWzQ4IDk0IDAgUiBdCj4+CmVuZG9iagoKMTk0IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvQmxvY2sKPj4KZW5kb2JqCgo5MCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDE5NCAwIFIKL0tbOTEgMCBSIDkzIDAgUiBdCj4+CmVuZG9iagoKOTcgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgOTYgMCBSCi9QZyAxIDAgUgovS1s1MCBdCj4+CmVuZG9iagoKMTk1IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKOTYgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDk1IDAgUgovUGcgMSAwIFIKL0EgMTk1IDAgUgovS1s0OSA5NyAwIFIgXQo+PgplbmRvYmoKCjk5IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDk4IDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoxOTYgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgo5OCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgOTUgMCBSCi9QZyAxIDAgUgovQSAxOTYgMCBSCi9LWzUxIDk5IDAgUiBdCj4+CmVuZG9iagoKMTk3IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvQmxvY2sKPj4KZW5kb2JqCgo5NSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDE5NyAwIFIKL0tbOTYgMCBSIDk4IDAgUiBdCj4+CmVuZG9iagoKMTAyIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDEwMSAwIFIKL1BnIDEgMCBSCi9LWzUzIF0KPj4KZW5kb2JqCgoxOTggMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoxMDEgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDEwMCAwIFIKL1BnIDEgMCBSCi9BIDE5OCAwIFIKL0tbNTIgMTAyIDAgUiBdCj4+CmVuZG9iagoKMTA0IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDEwMyAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMTk5IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTAzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMDAgMCBSCi9QZyAxIDAgUgovQSAxOTkgMCBSCi9LWzU0IDEwNCAwIFIgXQo+PgplbmRvYmoKCjIwMCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMTAwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMjAwIDAgUgovS1sxMDEgMCBSIDEwMyAwIFIgXQo+PgplbmRvYmoKCjEwNyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxMDYgMCBSCi9QZyAxIDAgUgovS1s1NiBdCj4+CmVuZG9iagoKMjAxIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTA2IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMDUgMCBSCi9QZyAxIDAgUgovQSAyMDEgMCBSCi9LWzU1IDEwNyAwIFIgXQo+PgplbmRvYmoKCjEwOSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxMDggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjIwMiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjEwOCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgMTA1IDAgUgovUGcgMSAwIFIKL0EgMjAyIDAgUgovS1s1NyAxMDkgMCBSIF0KPj4KZW5kb2JqCgoyMDMgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjEwNSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDIwMyAwIFIKL0tbMTA2IDAgUiAxMDggMCBSIF0KPj4KZW5kb2JqCgoxMTIgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgMTExIDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoyMDQgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoxMTEgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDExMCAwIFIKL1BnIDEgMCBSCi9BIDIwNCAwIFIKL0tbNTggMTEyIDAgUiBdCj4+CmVuZG9iagoKMTE0IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDExMyAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMjA1IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTEzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMTAgMCBSCi9QZyAxIDAgUgovQSAyMDUgMCBSCi9LWzU5IDExNCAwIFIgXQo+PgplbmRvYmoKCjIwNiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMTEwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMjA2IDAgUgovS1sxMTEgMCBSIDExMyAwIFIgXQo+PgplbmRvYmoKCjExNyAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxMTYgMCBSCi9QZyAxIDAgUgovS1s2MSBdCj4+CmVuZG9iagoKMjA3IDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTE2IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMTUgMCBSCi9QZyAxIDAgUgovQSAyMDcgMCBSCi9LWzYwIDExNyAwIFIgXQo+PgplbmRvYmoKCjExOSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvUAovUCAxMTggMCBSCi9QZyAxIDAgUgo+PgplbmRvYmoKCjIwOCAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0lubGluZQo+PgplbmRvYmoKCjExOCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVEQKL1AgMTE1IDAgUgovUGcgMSAwIFIKL0EgMjA4IDAgUgovS1s2MiAxMTkgMCBSIF0KPj4KZW5kb2JqCgoyMDkgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9CbG9jawo+PgplbmRvYmoKCjExNSAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVFIKL1AgNCAwIFIKL1BnIDEgMCBSCi9BIDIwOSAwIFIKL0tbMTE2IDAgUiAxMTggMCBSIF0KPj4KZW5kb2JqCgoxMjIgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1AKL1AgMTIxIDAgUgovUGcgMSAwIFIKPj4KZW5kb2JqCgoyMTAgMCBvYmoKPDwvTy9MYXlvdXQKL1BsYWNlbWVudC9JbmxpbmUKPj4KZW5kb2JqCgoxMjEgMCBvYmoKPDwvVHlwZS9TdHJ1Y3RFbGVtCi9TL1RECi9QIDEyMCAwIFIKL1BnIDEgMCBSCi9BIDIxMCAwIFIKL0tbNjMgMTIyIDAgUiBdCj4+CmVuZG9iagoKMTI0IDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9QCi9QIDEyMyAwIFIKL1BnIDEgMCBSCj4+CmVuZG9iagoKMjExIDAgb2JqCjw8L08vTGF5b3V0Ci9QbGFjZW1lbnQvSW5saW5lCj4+CmVuZG9iagoKMTIzIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9URAovUCAxMjAgMCBSCi9QZyAxIDAgUgovQSAyMTEgMCBSCi9LWzY0IDEyNCAwIFIgXQo+PgplbmRvYmoKCjIxMiAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCj4+CmVuZG9iagoKMTIwIDAgb2JqCjw8L1R5cGUvU3RydWN0RWxlbQovUy9UUgovUCA0IDAgUgovUGcgMSAwIFIKL0EgMjEyIDAgUgovS1sxMjEgMCBSIDEyMyAwIFIgXQo+PgplbmRvYmoKCjIxMyAwIG9iago8PC9PL0xheW91dAovUGxhY2VtZW50L0Jsb2NrCi9CQm94WzExMC40MDkgMjUyLjYyNCA1MTEuMTE1IDc2MS4wMThdCj4+CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL1N0cnVjdEVsZW0KL1MvVGFibGUKL1AgMTM4IDAgUgovUGcgMSAwIFIKL0EgMjEzIDAgUgovS1s1IDAgUiAxMCAwIFIgMTUgMCBSIDIwIDAgUiAyNSAwIFIgMzAgMCBSIDM1IDAgUiA0MCAwIFIgNDUgMCBSIDUwIDAgUiA1NSAwIFIgNjAgMCBSIDY1IDAgUiA3MCAwIFIgNzUgMCBSIDgwIDAgUgo4NSAwIFIgOTAgMCBSIDk1IDAgUiAxMDAgMCBSIDEwNSAwIFIgMTEwIDAgUiAxMTUgMCBSIDEyMCAwIFIgNjUgXQo+PgplbmRvYmoKCjEzOCAwIG9iago8PC9UeXBlL1N0cnVjdFRyZWVSb290Ci9QYXJlbnRUcmVlIDIxNCAwIFIKL0tbNCAwIFIgXQo+PgplbmRvYmoKCjIxNCAwIG9iago8PC9OdW1zWwowIFsgNiAwIFIgNyAwIFIgOCAwIFIgMTEgMCBSIDEzIDAgUiAxNiAwIFIgMTggMCBSIDIxIDAgUiAyMyAwIFIgMjYgMCBSCjI3IDAgUiAyOCAwIFIgMzEgMCBSIDMyIDAgUiAzMyAwIFIgMzYgMCBSIDM3IDAgUiAzOCAwIFIgNDEgMCBSIDQyIDAgUgo0MyAwIFIgNDYgMCBSIDQ4IDAgUiA1MSAwIFIgNTIgMCBSIDUzIDAgUiA1NiAwIFIgNTcgMCBSIDU4IDAgUiA2MSAwIFIKNjIgMCBSIDYzIDAgUiA2NiAwIFIgNjcgMCBSIDY4IDAgUiA3MSAwIFIgNzIgMCBSIDczIDAgUiA3NiAwIFIgNzcgMCBSCjc4IDAgUiA4MSAwIFIgODIgMCBSIDgzIDAgUiA4NiAwIFIgODggMCBSIDkxIDAgUiA5MiAwIFIgOTMgMCBSIDk2IDAgUgo5NyAwIFIgOTggMCBSIDEwMSAwIFIgMTAyIDAgUiAxMDMgMCBSIDEwNiAwIFIgMTA3IDAgUiAxMDggMCBSIDExMSAwIFIgMTEzIDAgUgoxMTYgMCBSIDExNyAwIFIgMTE4IDAgUiAxMjEgMCBSIDEyMyAwIFIgNCAwIFIgXQpdPj4KZW5kb2JqCgoxMjcgMCBvYmoKPDwvVHlwZS9QYWdlcwovUmVzb3VyY2VzIDEzNCAwIFIKL01lZGlhQm94WyAwIDAgNjEyIDc5MiBdCi9LaWRzWyAxIDAgUiBdCi9Db3VudCAxPj4KZW5kb2JqCgoyMTUgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDEyNyAwIFIKL09wZW5BY3Rpb25bMSAwIFIgL1hZWiBudWxsIG51bGwgMF0KL091dGxpbmVzIDEzNSAwIFIKL1N0cnVjdFRyZWVSb290IDEzOCAwIFIKL0xhbmcoZW4tQ0EpCi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4KL01ldGFkYXRhIDEzNyAwIFI+PgplbmRvYmoKCjIxNiAwIG9iago8PC9DcmVhdG9yPEZFRkYwMDQ0MDA3MjAwNjEwMDc3PgovUHJvZHVjZXI8RkVGRjAwNEMwMDY5MDA2MjAwNzIwMDY1MDA0RjAwNjYwMDY2MDA2OTAwNjMwMDY1MDAyMDAwMzcwMDJFMDAzNT4KL0NyZWF0aW9uRGF0ZShEOjIwMjQwODE2MTY1NzQ5LTA0JzAwJyk+PgplbmRvYmoKCnhyZWYKMCAyMTcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDMwODUxIDAwMDAwIG4gCjAwMDAwMDAwMTkgMDAwMDAgbiAKMDAwMDAwMTk3MiAwMDAwMCBuIAowMDAwMDQ5ODQ1IDAwMDAwIG4gCjAwMDAwMzY2OTEgMDAwMDAgbiAKMDAwMDAzNjI4NCAwMDAwMCBuIAowMDAwMDM2MTE4IDAwMDAwIG4gCjAwMDAwMzY1NDIgMDAwMDAgbiAKMDAwMDAzNjM4MyAwMDAwMCBuIAowMDAwMDM3MjQyIDAwMDAwIG4gCjAwMDAwMzY4OTcgMDAwMDAgbiAKMDAwMDAzNjc4MiAwMDAwMCBuIAowMDAwMDM3MTAyIDAwMDAwIG4gCjAwMDAwMzY5ODcgMDAwMDAgbiAKMDAwMDAzNzc5NiAwMDAwMCBuIAowMDAwMDM3NDUxIDAwMDAwIG4gCjAwMDAwMzczMzYgMDAwMDAgbiAKMDAwMDAzNzY1NiAwMDAwMCBuIAowMDAwMDM3NTQxIDAwMDAwIG4gCjAwMDAwMzgzNTAgMDAwMDAgbiAKMDAwMDAzODAwNSAwMDAwMCBuIAowMDAwMDM3ODkwIDAwMDAwIG4gCjAwMDAwMzgyMTAgMDAwMDAgbiAKMDAwMDAzODA5NSAwMDAwMCBuIAowMDAwMDM4OTEzIDAwMDAwIG4gCjAwMDAwMzg1NjcgMDAwMDAgbiAKMDAwMDAzODQ0NCAwMDAwMCBuIAowMDAwMDM4NzcyIDAwMDAwIG4gCjAwMDAwMzg2NTcgMDAwMDAgbiAKMDAwMDAzOTQ3NyAwMDAwMCBuIAowMDAwMDM5MTMwIDAwMDAwIG4gCjAwMDAwMzkwMDcgMDAwMDAgbiAKMDAwMDAzOTMzNiAwMDAwMCBuIAowMDAwMDM5MjIxIDAwMDAwIG4gCjAwMDAwNDAwNDEgMDAwMDAgbiAKMDAwMDAzOTY5NCAwMDAwMCBuIAowMDAwMDM5NTcxIDAwMDAwIG4gCjAwMDAwMzk5MDAgMDAwMDAgbiAKMDAwMDAzOTc4NSAwMDAwMCBuIAowMDAwMDQwNjA1IDAwMDAwIG4gCjAwMDAwNDAyNTggMDAwMDAgbiAKMDAwMDA0MDEzNSAwMDAwMCBuIAowMDAwMDQwNDY0IDAwMDAwIG4gCjAwMDAwNDAzNDkgMDAwMDAgbiAKMDAwMDA0MTE2MSAwMDAwMCBuIAowMDAwMDQwODE0IDAwMDAwIG4gCjAwMDAwNDA2OTkgMDAwMDAgbiAKMDAwMDA0MTAyMCAwMDAwMCBuIAowMDAwMDQwOTA1IDAwMDAwIG4gCjAwMDAwNDE3MjUgMDAwMDAgbiAKMDAwMDA0MTM3OCAwMDAwMCBuIAowMDAwMDQxMjU1IDAwMDAwIG4gCjAwMDAwNDE1ODQgMDAwMDAgbiAKMDAwMDA0MTQ2OSAwMDAwMCBuIAowMDAwMDQyMjg5IDAwMDAwIG4gCjAwMDAwNDE5NDIgMDAwMDAgbiAKMDAwMDA0MTgxOSAwMDAwMCBuIAowMDAwMDQyMTQ4IDAwMDAwIG4gCjAwMDAwNDIwMzMgMDAwMDAgbiAKMDAwMDA0Mjg1MyAwMDAwMCBuIAowMDAwMDQyNTA2IDAwMDAwIG4gCjAwMDAwNDIzODMgMDAwMDAgbiAKMDAwMDA0MjcxMiAwMDAwMCBuIAowMDAwMDQyNTk3IDAwMDAwIG4gCjAwMDAwNDM0MTcgMDAwMDAgbiAKMDAwMDA0MzA3MCAwMDAwMCBuIAowMDAwMDQyOTQ3IDAwMDAwIG4gCjAwMDAwNDMyNzYgMDAwMDAgbiAKMDAwMDA0MzE2MSAwMDAwMCBuIAowMDAwMDQzOTgxIDAwMDAwIG4gCjAwMDAwNDM2MzQgMDAwMDAgbiAKMDAwMDA0MzUxMSAwMDAwMCBuIAowMDAwMDQzODQwIDAwMDAwIG4gCjAwMDAwNDM3MjUgMDAwMDAgbiAKMDAwMDA0NDU0NSAwMDAwMCBuIAowMDAwMDQ0MTk4IDAwMDAwIG4gCjAwMDAwNDQwNzUgMDAwMDAgbiAKMDAwMDA0NDQwNCAwMDAwMCBuIAowMDAwMDQ0Mjg5IDAwMDAwIG4gCjAwMDAwNDUxMDkgMDAwMDAgbiAKMDAwMDA0NDc2MiAwMDAwMCBuIAowMDAwMDQ0NjM5IDAwMDAwIG4gCjAwMDAwNDQ5NjggMDAwMDAgbiAKMDAwMDA0NDg1MyAwMDAwMCBuIAowMDAwMDQ1NjY1IDAwMDAwIG4gCjAwMDAwNDUzMTggMDAwMDAgbiAKMDAwMDA0NTIwMyAwMDAwMCBuIAowMDAwMDQ1NTI0IDAwMDAwIG4gCjAwMDAwNDU0MDkgMDAwMDAgbiAKMDAwMDA0NjIyOSAwMDAwMCBuIAowMDAwMDQ1ODgyIDAwMDAwIG4gCjAwMDAwNDU3NTkgMDAwMDAgbiAKMDAwMDA0NjA4OCAwMDAwMCBuIAowMDAwMDQ1OTczIDAwMDAwIG4gCjAwMDAwNDY3OTMgMDAwMDAgbiAKMDAwMDA0NjQ0NiAwMDAwMCBuIAowMDAwMDQ2MzIzIDAwMDAwIG4gCjAwMDAwNDY2NTIgMDAwMDAgbiAKMDAwMDA0NjUzNyAwMDAwMCBuIAowMDAwMDQ3MzY3IDAwMDAwIG4gCjAwMDAwNDcwMTIgMDAwMDAgbiAKMDAwMDA0Njg4NyAwMDAwMCBuIAowMDAwMDQ3MjIzIDAwMDAwIG4gCjAwMDAwNDcxMDYgMDAwMDAgbiAKMDAwMDA0Nzk0NCAwMDAwMCBuIAowMDAwMDQ3NTg5IDAwMDAwIG4gCjAwMDAwNDc0NjQgMDAwMDAgbiAKMDAwMDA0NzgwMCAwMDAwMCBuIAowMDAwMDQ3NjgzIDAwMDAwIG4gCjAwMDAwNDg1MTMgMDAwMDAgbiAKMDAwMDA0ODE1OCAwMDAwMCBuIAowMDAwMDQ4MDQxIDAwMDAwIG4gCjAwMDAwNDgzNjkgMDAwMDAgbiAKMDAwMDA0ODI1MiAwMDAwMCBuIAowMDAwMDQ5MDkwIDAwMDAwIG4gCjAwMDAwNDg3MzUgMDAwMDAgbiAKMDAwMDA0ODYxMCAwMDAwMCBuIAowMDAwMDQ4OTQ2IDAwMDAwIG4gCjAwMDAwNDg4MjkgMDAwMDAgbiAKMDAwMDA0OTY1OSAwMDAwMCBuIAowMDAwMDQ5MzA0IDAwMDAwIG4gCjAwMDAwNDkxODcgMDAwMDAgbiAKMDAwMDA0OTUxNSAwMDAwMCBuIAowMDAwMDQ5Mzk4IDAwMDAwIG4gCjAwMDAwMDE5OTMgMDAwMDAgbiAKMDAwMDAxOTk5NCAwMDAwMCBuIAowMDAwMDUwNjg3IDAwMDAwIG4gCjAwMDAwMjAwMTggMDAwMDAgbiAKMDAwMDAyOTc2OCAwMDAwMCBuIAowMDAwMDI5NzkxIDAwMDAwIG4gCjAwMDAwMjk5ODkgMDAwMDAgbiAKMDAwMDAzMDQ0OCAwMDAwMCBuIAowMDAwMDMwNzU5IDAwMDAwIG4gCjAwMDAwMzA3OTQgMDAwMDAgbiAKMDAwMDAzMDk2OSAwMDAwMCBuIAowMDAwMDMxMDI4IDAwMDAwIG4gCjAwMDAwMzExMzUgMDAwMDAgbiAKMDAwMDA1MDEwNCAwMDAwMCBuIAowMDAwMDM2MTg3IDAwMDAwIG4gCjAwMDAwMzYyMzggMDAwMDAgbiAKMDAwMDAzNjQ0NSAwMDAwMCBuIAowMDAwMDM2NDk2IDAwMDAwIG4gCjAwMDAwMzY2NDEgMDAwMDAgbiAKMDAwMDAzNjg0NiAwMDAwMCBuIAowMDAwMDM3MDUxIDAwMDAwIG4gCjAwMDAwMzcxOTIgMDAwMDAgbiAKMDAwMDAzNzQwMCAwMDAwMCBuIAowMDAwMDM3NjA1IDAwMDAwIG4gCjAwMDAwMzc3NDYgMDAwMDAgbiAKMDAwMDAzNzk1NCAwMDAwMCBuIAowMDAwMDM4MTU5IDAwMDAwIG4gCjAwMDAwMzgzMDAgMDAwMDAgbiAKMDAwMDAzODUxNiAwMDAwMCBuIAowMDAwMDM4NzIxIDAwMDAwIG4gCjAwMDAwMzg4NjMgMDAwMDAgbiAKMDAwMDAzOTA3OSAwMDAwMCBuIAowMDAwMDM5Mjg1IDAwMDAwIG4gCjAwMDAwMzk0MjcgMDAwMDAgbiAKMDAwMDAzOTY0MyAwMDAwMCBuIAowMDAwMDM5ODQ5IDAwMDAwIG4gCjAwMDAwMzk5OTEgMDAwMDAgbiAKMDAwMDA0MDIwNyAwMDAwMCBuIAowMDAwMDQwNDEzIDAwMDAwIG4gCjAwMDAwNDA1NTUgMDAwMDAgbiAKMDAwMDA0MDc2MyAwMDAwMCBuIAowMDAwMDQwOTY5IDAwMDAwIG4gCjAwMDAwNDExMTEgMDAwMDAgbiAKMDAwMDA0MTMyNyAwMDAwMCBuIAowMDAwMDQxNTMzIDAwMDAwIG4gCjAwMDAwNDE2NzUgMDAwMDAgbiAKMDAwMDA0MTg5MSAwMDAwMCBuIAowMDAwMDQyMDk3IDAwMDAwIG4gCjAwMDAwNDIyMzkgMDAwMDAgbiAKMDAwMDA0MjQ1NSAwMDAwMCBuIAowMDAwMDQyNjYxIDAwMDAwIG4gCjAwMDAwNDI4MDMgMDAwMDAgbiAKMDAwMDA0MzAxOSAwMDAwMCBuIAowMDAwMDQzMjI1IDAwMDAwIG4gCjAwMDAwNDMzNjcgMDAwMDAgbiAKMDAwMDA0MzU4MyAwMDAwMCBuIAowMDAwMDQzNzg5IDAwMDAwIG4gCjAwMDAwNDM5MzEgMDAwMDAgbiAKMDAwMDA0NDE0NyAwMDAwMCBuIAowMDAwMDQ0MzUzIDAwMDAwIG4gCjAwMDAwNDQ0OTUgMDAwMDAgbiAKMDAwMDA0NDcxMSAwMDAwMCBuIAowMDAwMDQ0OTE3IDAwMDAwIG4gCjAwMDAwNDUwNTkgMDAwMDAgbiAKMDAwMDA0NTI2NyAwMDAwMCBuIAowMDAwMDQ1NDczIDAwMDAwIG4gCjAwMDAwNDU2MTUgMDAwMDAgbiAKMDAwMDA0NTgzMSAwMDAwMCBuIAowMDAwMDQ2MDM3IDAwMDAwIG4gCjAwMDAwNDYxNzkgMDAwMDAgbiAKMDAwMDA0NjM5NSAwMDAwMCBuIAowMDAwMDQ2NjAxIDAwMDAwIG4gCjAwMDAwNDY3NDMgMDAwMDAgbiAKMDAwMDA0Njk2MSAwMDAwMCBuIAowMDAwMDQ3MTcyIDAwMDAwIG4gCjAwMDAwNDczMTcgMDAwMDAgbiAKMDAwMDA0NzUzOCAwMDAwMCBuIAowMDAwMDQ3NzQ5IDAwMDAwIG4gCjAwMDAwNDc4OTQgMDAwMDAgbiAKMDAwMDA0ODEwNyAwMDAwMCBuIAowMDAwMDQ4MzE4IDAwMDAwIG4gCjAwMDAwNDg0NjMgMDAwMDAgbiAKMDAwMDA0ODY4NCAwMDAwMCBuIAowMDAwMDQ4ODk1IDAwMDAwIG4gCjAwMDAwNDkwNDAgMDAwMDAgbiAKMDAwMDA0OTI1MyAwMDAwMCBuIAowMDAwMDQ5NDY0IDAwMDAwIG4gCjAwMDAwNDk2MDkgMDAwMDAgbiAKMDAwMDA0OTc1NiAwMDAwMCBuIAowMDAwMDUwMTc5IDAwMDAwIG4gCjAwMDAwNTA3ODkgMDAwMDAgbiAKMDAwMDA1MDk3NCAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgMjE3L1Jvb3QgMjE1IDAgUgovSW5mbyAyMTYgMCBSCi9JRCBbIDw3M0IyN0EyRDhDMTgzMjQ2MUUwRDZDQ0FGOTkzOTlDQj4KPDczQjI3QTJEOEMxODMyNDYxRTBENkNDQUY5OTM5OUNCPiBdCi9Eb2NDaGVja3N1bSAvOUNDQzRBOEZCMUEzOUUzRjBDOTQwMDI0QUIzMEE5ODMKL0FkZGl0aW9uYWxTdHJlYW1zIFsvYXBwbGljYXRpb24jMkZ2bmQjMkVvYXNpcyMyRW9wZW5kb2N1bWVudCMyRWdyYXBoaWNzIDEyNSAwIFIKXQo+PgpzdGFydHhyZWYKNTExNDIKJSVFT0YK",
      "pdfmeVersion": "4.0.0"
    };
    const plugins = { text, image, qrcode: barcodes.qrcode };
    const arrayData2 = [data];

    const inputs = [
      {
        "dateNow": data.dateNow,
        "dept": data.dept,
        "subTotal": data.subTotal,
        "tax": data.tax,
        "total": data.total,
        "cashTotal": data.cashTotal,
        "debitTotal": data.debitTotal,
        "creditTotal": data.creditTotal,
        "chequeTotal": data.chequeTotal,
        "onlineTotal": data.onlineTotal,
        "eTransferTotal": data.eTransferTotal,
        "visaTotal": data.visaTotal,
        "mastercardTotal": data.mastercardTotal,
        "amexTotal": data.amexTotal,
        ...arrayData2.map((sale, index) => ({
          [`sales${index + 1}`]: sale.sales || 0,
          [`salesTotal${index + 1}`]: sale.totalSales || '0.00'
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
      }
    ];
    console.log(inputs, 'inputs')
    const pdf = await generate({ template, plugins, inputs });
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    window.open(URL.createObjectURL(blob));
  }
  return RunIt(data)
}
