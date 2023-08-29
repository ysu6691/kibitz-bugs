// @ts-nocheck

// const board = new Array(N).fill(null).map(() => new Array(N).fill(0));

export const gomokuPlay = (board: number[][]) => {
  const N = 16;

  const dr = [1, 0, 1, 1];
  const dc = [0, 1, 1, -1];

  const finishPositions = new Set();
  const blockedPositions = new Set();

  const fourPositions = new Set();

  const black = 1;
  const white = 2;

  const three_cases = [
    { 1: 1, 2: 1, "-1": 0, 3: 0 },
    { "-1": 1, 1: 1, "-2": 0, "-3": 0, 2: 0 },
    { "-1": 1, 1: 1, "-2": 0, 2: 0, 3: 0 },
    { "-2": 1, "-1": 1, "-3": 0, 1: 0 },
    { 1: 1, 2: 0, 3: 1, "-1": 0, 4: 0 },
    { 1: 0, 2: 1, 3: 1, "-1": 0, 4: 0 },
    { "-1": 1, 1: 0, 2: 1, "-2": 0, 3: 0 },
    { "-2": 1, "-1": 0, 1: 1, "-3": 0, 2: 0 },
    { "-3": 1, "-2": 0, "-1": 1, "-4": 0, 1: 0 },
    { "-3": 1, "-2": 1, "-1": 0, "-4": 0, 1: 0 },
  ];

  const four_cases = [
    { "-3": 1, "-2": 1, "-1": 1, "-4": 4, 1: 4 },
    { "-2": 1, "-1": 1, 1: 1, "-3": 4, 2: 4 },
    { "-1": 1, 1: 1, 2: 1, "-2": 4, 3: 4 },
    { 1: 1, 2: 1, 3: 1, "-1": 4, 4: 4 },
    { "-4": 1, "-3": 1, "-2": 1, "-1": 0, "-5": 4, 1: 4 },
    { "-4": 1, "-3": 1, "-2": 0, "-1": 1, "-5": 4, 1: 4 },
    { "-4": 1, "-3": 0, "-2": 1, "-1": 1, "-5": 4, 1: 4 },
    { "-3": 1, "-2": 1, "-1": 0, 1: 1, "-4": 4, 2: 4 },
    { "-3": 1, "-2": 0, "-1": 1, 1: 1, "-4": 4, 2: 4 },
    { "-2": 1, "-1": 1, 1: 0, 2: 1, "-3": 4, 3: 4 },
    { "-2": 1, "-1": 0, 1: 1, 2: 1, "-3": 4, 3: 4 },
    { "-1": 1, 1: 1, 2: 0, 3: 1, "-2": 4, 4: 4 },
    { "-1": 1, 1: 0, 2: 1, 3: 1, "-2": 4, 4: 4 },
    { 1: 1, 2: 1, 3: 0, 4: 1, "-1": 4, 5: 4 },
    { 1: 1, 2: 0, 3: 1, 4: 1, "-1": 4, 5: 4 },
    { 1: 0, 2: 1, 3: 1, 4: 1, "-1": 4, 5: 4 },
  ];

  // 4: 흑돌이 아닌 곳(백돌 or 빈공간 or board 외부)
  const open_four_cases = [
    { "-2": 4, "-1": 0, 1: 1, 2: 1, 3: 1, 4: 0, 5: 4 },
    { "-3": 4, "-2": 0, "-1": 1, 1: 1, 2: 1, 3: 0, 4: 4 },
    { "-4": 4, "-3": 0, "-2": 1, "-1": 1, 1: 1, 2: 0, 3: 4 },
    { "-5": 4, "-4": 0, "-3": 1, "-2": 1, "-1": 1, 1: 0, 2: 4 },
  ];

  const checkFiveOrSix = function () {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] != 0) {
          continue;
        }

        let flag = false;
        for (let d = 0; d < 4; d++) {
          // 5목 & 6목 판단
          // 5개 보기
          for (let i = -4; i <= 0; i++) {
            let tmp = 0;
            for (let j = 0; j < 5; j++) {
              const nr = r + dr[d] * (i + j);
              const nc = c + dc[d] * (i + j);
              if (nr < 0 || nr >= N || nc < 0 || nc >= N) {
                break;
              }
              if ((nr != r || nc != c) && board[nr][nc] == black) {
                tmp++;
              }
            }

            // 만약 내 자리 빼고 다 차있다면
            if (tmp == 4) {
              // 양 끝 확인
              for (let j = i - 1; j <= i + 5; j += 6) {
                const nr = r + dr[d] * j;
                const nc = c + dc[d] * j;
                if (nr < 0 || nr >= N || nc < 0 || nc >= N) {
                  continue;
                }
                // 흑돌이 하나라도 있다면 6목
                if (board[nr][nc] == black) {
                  blockedPositions.add(r + " " + c);
                  if (r == 1 && c == 10) {
                    console.log("6목때문");
                  }
                  flag = true;
                  break;
                }
              }
              // 흑돌이 없다면 5목
              if (!flag) {
                finishPositions.add(r + " " + c);
                flag = true;
              }
              break;
            }
          }
          if (flag) {
            break;
          }
        }
      }
    }
  };

  const checkDoubleFour = function () {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (
          board[r][c] != 0 ||
          finishPositions.has(r + " " + c) ||
          blockedPositions.has(r + " " + c)
        ) {
          continue;
        }
        let fourCnt = 0;

        for (let d = 0; d < 4; d++) {
          for (const obj of four_cases) {
            let flag = false;
            const list = Object.entries(obj);
            for (const position of list) {
              const nr = r + dr[d] * position[0];
              const nc = c + dc[d] * position[0];

              if (nr < 0 || nr >= N || nc < 0 || nc >= N) {
                if (position[1] == 4) {
                  continue;
                } else {
                  flag = true;
                  break;
                }
              }
              if (position[1] == 4) {
                if (board[nr][nc] == 1) {
                  flag = true;
                  break;
                }
              } else {
                if (board[nr][nc] != position[1]) {
                  flag = true;
                  break;
                }
              }

              // if (nr < 0 || nr >= N || nc < 0 || nc >= N) {
              //   flag = true;
              //   break;
              // }
              // if (board[nr][nc] != position[1]) {
              //   flag = true;
              //   break;
              // }
            }
            if (!flag) {
              fourCnt++;
              fourPositions.add(r + " " + c);
            }
          }
        }
        if (fourCnt > 1) {
          blockedPositions.add(r + " " + c);
          if (r == 1 && c == 10) {
            console.log("44때문");
          }
        }
      }
    }
  };

  const checkDoubleThree = function () {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (
          board[r][c] != 0 ||
          finishPositions.has(r + " " + c) ||
          blockedPositions.has(r + " " + c) ||
          fourPositions.has(r + " " + c)
        ) {
          continue;
        }
        const doubleThreeCandidates = [];

        for (let d = 0; d < 4; d++) {
          for (const obj of three_cases) {
            let flag = false;
            const list = Object.entries(obj);
            for (const position of list) {
              const nr = r + dr[d] * position[0];
              const nc = c + dc[d] * position[0];
              if (nr < 0 || nr >= N || nc < 0 || nc >= N) {
                flag = true;
                break;
              }
              if (board[nr][nc] != position[1]) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              list.push(d);
              doubleThreeCandidates.push(list);
              break;
            }
          }
        }
        if (doubleThreeCandidates.length > 1) {
          // if (r == 4 && c == 5) {
          //   console.log(doubleThreeCandidates);
          // }
          board[r][c] = 1;
          let cnt = 0;
          for (const candidate of doubleThreeCandidates) {
            let flag = false;
            for (const position of candidate) {
              if (typeof position == "number") {
                break;
              }
              // if (r == 4 && c == 5) {
              //   console.log("position:", position);
              // }

              if (position[1] == 0) {
                const nr =
                  r + dr[candidate[candidate.length - 1]] * position[0];
                const nc =
                  c + dc[candidate[candidate.length - 1]] * position[0];
                if (
                  finishPositions.has(nr + " " + nc) ||
                  blockedPositions.has(nr + " " + nc)
                ) {
                  continue;
                }

                if (!checkFalseProhibition(r, c, nr, nc)) {
                  cnt++;
                  break;
                }
              }
            }
          }
          if (cnt > 1) {
            if (r == 1 && c == 10) {
              console.log("33때문");
            }
            blockedPositions.add(r + " " + c);
          }
          board[r][c] = 0;
        }
      }
    }
  };

  const checkFalseProhibition = function (r, c, nr, nc) {
    // 6목이면 거짓금수
    for (let d = 0; d < 4; d++) {
      for (let i = -4; i <= 0; i++) {
        let tmp = 0;
        for (let j = 0; j < 5; j++) {
          const new_r = nr + dr[d] * (i + j);
          const new_c = nc + dc[d] * (i + j);
          if (new_r < 0 || new_r >= N || new_c < 0 || new_c >= N) {
            break;
          }
          if ((new_r != nr || new_c != nc) && board[new_r][new_c] == black) {
            tmp++;
          }
        }
        if (tmp == 4) {
          for (let j = i - 1; j <= i + 5; j += 6) {
            const newR = nr + dr[d] * j;
            const newC = nc + dc[d] * j;
            if (newR < 0 || newR >= N || newC < 0 || newC >= N) {
              continue;
            }
            if (board[newR][newC] == black) {
              return true;
            }
          }
        }
      }
    }

    // 44면 거짓 금수
    let fourCnt = 0;
    for (let d = 0; d < 4; d++) {
      for (const obj of four_cases) {
        let flag = false;
        const list = Object.entries(obj);
        for (const position of list) {
          const newR = nr + dr[d] * position[0];
          const newC = nc + dc[d] * position[0];
          if (r == 3 && c == 5 && nr == 7 && nc == 5) {
            console.log(position, newR, newC);
          }
          if (newR < 0 || newR >= N || newC < 0 || newC >= N) {
            flag = true;
            break;
          }
          if (board[newR][newC] != position[1]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          fourCnt++;
        }
      }
    }
    if (fourCnt > 1) {
      return true;
    }

    // 열린 4를 만들 수 있으면 거짓 금수 x
    for (let d = 0; d < 4; d++) {
      for (const obj of open_four_cases) {
        const list = Object.entries(obj);
        let flag = false;
        for (const position of list) {
          const newR = nr + dr[d] * position[0];
          const newC = nc + dc[d] * position[0];
          if (newR < 0 || newR >= N || newC < 0 || newC >= N) {
            if (position[1] == 4) {
              continue;
            } else {
              flag = true;
              break;
            }
          }
          if (position[1] == 4) {
            if (board[newR][newC] == 1) {
              flag = true;
              break;
            }
          } else {
            if (board[newR][newC] != position[1]) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          return false;
        }
      }
    }
    return true;
  };

  checkFiveOrSix();
  checkDoubleFour();
  checkDoubleThree();

  console.log(blockedPositions);

  return [blockedPositions, finishPositions];
};
