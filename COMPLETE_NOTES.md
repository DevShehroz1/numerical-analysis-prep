# Numerical Analysis - Complete Midterm Notes

> Full study notes covering all 6 topics for the midterm exam.
> Interactive version: `study-guide.html` (open in browser)

---

## Table of Contents

1. [Basics & Error Types](#basics--error-types)
2. [Bisection Method](#topic-1-bisection-method)
3. [False Position Method](#topic-2-false-position-method)
4. [Newton-Raphson Method](#topic-3-newton-raphson-method)
5. [Secant Method](#topic-4-secant-method)
6. [Gauss Elimination](#topic-5-gauss-elimination)
7. [Gauss-Jordan Elimination](#topic-6-gauss-jordan-elimination)
8. [Method Comparison Table](#method-comparison-table)
9. [Exam Tips](#exam-tips)

---

## Basics & Error Types

### Why Numerical Methods?

Some equations can't be solved by algebra:
- `x^3 - x - 1 = 0` (no simple formula)
- `e^x - x = 0` (transcendental)
- `ln(x) + x - 2 = 0`

We use **numerical methods** — algorithms that iterate toward the answer.

### Types of Errors

**1. Round-off Error** — from rounding numbers
- Example: `1/3 = 0.3333` (rounded, not exact)

**2. Truncation Error** — from stopping a calculation early
- Example: `e^x = 1 + x + x^2/2 + ...` → if we stop at `1 + x`, that's truncation error

**3. Absolute Error** = `|True - Approximate|`

**4. Relative Error** = `|True - Approximate| / |True|`

### Transcendental Equations
Equations containing `e^x`, `ln(x)`, `sin(x)`, `cos(x)`, etc. — cannot be written as polynomials.

---

## TOPIC 1: BISECTION METHOD

### Core Idea
If `f(a)` and `f(b)` have opposite signs, a root MUST exist between them. Keep cutting the interval in HALF until you find it.

### Conditions
- Function must be **continuous** in [a, b]
- **`f(a) × f(b) < 0`** (opposite signs — MANDATORY)

### Formula
```
c = (a + b) / 2       ← the midpoint
```

### Algorithm
1. Choose a, b such that `f(a) × f(b) < 0`
2. Compute `c = (a+b)/2`
3. Compute `f(c)`
4. Decide:
   - If `f(a) × f(c) < 0` → root in [a, c] → set **b = c**
   - If `f(a) × f(c) > 0` → root in [c, b] → set **a = c**
   - If `f(c) = 0` → c IS the root, STOP
5. Repeat until `|c_new - c_old| < ε`

### Minimum Iterations Formula
```
n >= log((b-a)/ε) / log(2)
```

### Worked Example 1: `f(x) = x^3 - x - 1 = 0`

**Step 1 — Find interval:**
- f(0) = 0 − 0 − 1 = **−1** (neg)
- f(1) = 1 − 1 − 1 = **−1** (neg)
- f(2) = 8 − 2 − 1 = **+5** (pos) ✓

Sign change between 1 and 2 → **a = 1, b = 2**

**Step 2 — Iteration Table:**

| Iter | a      | b      | c = (a+b)/2 | f(c)    | New Interval      |
|------|--------|--------|-------------|---------|-------------------|
| 1    | 1.000  | 2.000  | **1.500**   | +0.875  | [1, 1.5]          |
| 2    | 1.000  | 1.500  | **1.250**   | −0.297  | [1.25, 1.5]       |
| 3    | 1.250  | 1.500  | **1.375**   | +0.224  | [1.25, 1.375]     |
| 4    | 1.250  | 1.375  | **1.3125**  | −0.051  | [1.3125, 1.375]   |
| 5    | 1.3125 | 1.375  | **1.3438**  | +0.082  | [1.3125, 1.3438]  |
| 6    | 1.3125 | 1.3438 | **1.3281**  | +0.014  | [1.3125, 1.3281]  |
| 7    | 1.3125 | 1.3281 | **1.3203**  | −0.018  | [1.3203, 1.3281]  |
| 8    | 1.3203 | 1.3281 | **1.3242**  | −0.002  | [1.3242, 1.3281]  |

**Answer: x ≈ 1.324**

### Detailed Walkthrough of Each Iteration

**ITERATION 1:**
- Start: a = 1, b = 2
- c = (1 + 2)/2 = **1.5**
- f(1.5) = (1.5)³ − 1.5 − 1 = 3.375 − 2.5 = **+0.875**
- Check: f(a)·f(c) = (−1)(+0.875) = −0.875 < 0 → **opposite signs**
- Root is in [a, c] → set **b = 1.5**, a stays 1

**ITERATION 2:**
- Start: a = 1, b = 1.5
- c = (1 + 1.5)/2 = **1.25**
- f(1.25) = (1.25)³ − 1.25 − 1 = 1.953 − 2.25 = **−0.297**
- Check: f(a)·f(c) = (−1)(−0.297) = +0.297 > 0 → **same signs**
- Root is in [c, b] → set **a = 1.25**, b stays 1.5

**ITERATION 3:**
- a = 1.25, b = 1.5
- c = (1.25 + 1.5)/2 = **1.375**
- f(1.375) = (1.375)³ − 1.375 − 1 = 2.5996 − 2.375 = **+0.224**
- Check: (−0.297)(+0.224) < 0 → opposite → set **b = 1.375**

(Pattern continues — each time the interval gets cut in half)

### Worked Example 2: `e^(-x) - x = 0`
- f(0) = 1 > 0, f(1) = 0.3679 − 1 = −0.6321 < 0 → root in [0, 1]
- After 11 iterations with ε = 0.0005: **x ≈ 0.567**

### Worked Example 3: `ln(x) - 1 = 0`
- f(2) = 0.6931 − 1 = −0.3069, f(3) = 1.0986 − 1 = +0.0986 → root in [2, 3]
- After 11 iterations: **x ≈ 2.719** (which is actually e!)

---

## TOPIC 2: FALSE POSITION METHOD

### Core Idea
Instead of the midpoint, draw a **straight line** between (a, f(a)) and (b, f(b)). Use where the line crosses the x-axis as the next estimate.

### Why It's Better Than Bisection
If f(a) is close to zero but f(b) is far from zero, the root is probably closer to a. False Position accounts for this.

### Formula
```
x_r = b - f(b) × (a - b) / (f(a) - f(b))
```
Alternative equivalent form:
```
x_r = [a × f(b) - b × f(a)] / [f(b) - f(a)]
```

### Algorithm
Same as Bisection, but use the formula above instead of `(a+b)/2`.

### Worked Example: `f(x) = x^3 - x - 2 = 0`

- f(1) = 1 − 1 − 2 = −2
- f(2) = 8 − 2 − 2 = +4 → root in [1, 2]

**Iteration 1:**
```
x_r = 2 - 4 × (1 - 2) / (-2 - 4)
    = 2 - (4)(-1)/(-6)
    = 2 - (-4/-6)
    = 2 - 0.6667 = 1.3333
```
- f(1.3333) = 2.3704 − 1.3333 − 2 = −0.9630
- f(a)·f(x_r) = (−2)(−0.963) > 0 → same sign → **a = 1.3333**

**Full Table:**

| Iter | a       | b    | x_r      | f(x_r)   | \|diff\|  |
|------|---------|------|----------|----------|-----------|
| 1    | 1.0000  | 2.00 | 1.33333  | −0.96298 | —         |
| 2    | 1.33333 | 2.00 | 1.46269  | −0.33332 | 0.12936   |
| 3    | 1.46269 | 2.00 | 1.50402  | −0.10181 | 0.04133   |
| 4    | 1.50402 | 2.00 | 1.51633  | −0.02990 | 0.01231   |
| 5    | 1.51633 | 2.00 | 1.51992  | −0.00867 | 0.00359   |
| 6    | 1.51992 | 2.00 | 1.52096  | −0.00249 | 0.00104   |
| 7    | 1.52096 | 2.00 | 1.52126  | −0.00072 | 0.0003 ✓  |

**Answer: x ≈ 1.521**

**Important observation:** Notice b = 2 never changed! In False Position, one endpoint can get "stuck."

### Absolute Relative Approximate Error
```
|ε_a| = |(x_r_new - x_r_old) / x_r_new| × 100%
```

### Significant Digits Formula
```
|ε_a| ≤ 0.5 × 10^(2-m)
```
Solve for m to find number of correct significant digits.

---

## TOPIC 3: NEWTON-RAPHSON METHOD

### Core Idea
Draw the **tangent line** at the current guess. Where the tangent hits the x-axis is the next guess. VERY fast convergence (quadratic).

### Requirements
- Only ONE initial guess x₀
- **MUST know the derivative f'(x)**
- Open method (doesn't need bracketing)

### Formula
```
x_{n+1} = x_n - f(x_n) / f'(x_n)
```

### Common Derivatives You'll Need
| Function | Derivative |
|----------|------------|
| x^n      | n·x^(n-1)  |
| e^x      | e^x        |
| e^(-x)   | −e^(-x)    |
| ln(x)    | 1/x        |
| sin(x)   | cos(x)     |
| cos(x)   | −sin(x)    |
| constant | 0          |

### Algorithm
1. Choose initial guess x₀ (pick integer with f closest to zero)
2. Compute f(x₀) and f'(x₀)
3. Apply formula: x_{n+1} = x_n − f(x_n)/f'(x_n)
4. Repeat until |x_{n+1} − x_n| < ε

### Worked Example: `f(x) = x^3 - x - 1`

**Setup:** f(x) = x³ − x − 1, so f'(x) = 3x² − 1
- f(0) = −1, f(1) = −1, f(2) = 5 → choose **x₀ = 1** (closest to 0)

**Iteration 1:**
```
f(1) = 1 - 1 - 1 = -1
f'(1) = 3(1)² - 1 = 2
x₁ = 1 - (-1)/2 = 1 + 0.5 = 1.5
|x₁ - x₀| = 0.5 > 0.001 → continue
```

**Iteration 2:**
```
f(1.5) = (1.5)³ - 1.5 - 1 = 3.375 - 2.5 = 0.875
f'(1.5) = 3(1.5)² - 1 = 6.75 - 1 = 5.75
x₂ = 1.5 - 0.875/5.75 = 1.5 - 0.15217 = 1.34783
```

**Iteration 3:**
```
f(1.34783) = 2.44802 - 2.34783 = 0.1007
f'(1.34783) = 3(1.81665) - 1 = 4.44994
x₃ = 1.34783 - 0.1007/4.44994 = 1.32520
```

**Iteration 4:**
```
f(1.32520) = 0.00306
f'(1.32520) = 4.26847
x₄ = 1.3252 - 0.00306/4.26847 = 1.32472
|x₄ - x₃| = 0.00048 < 0.001 ✓ STOP
```

**Answer: x ≈ 1.325** (only 4 iterations vs Bisection's 8+)

### Limitations
- Fails if f'(x_n) = 0 (division by zero)
- May diverge if starting guess is bad
- Requires knowing the derivative

---

## TOPIC 4: SECANT METHOD

### Core Idea
Like Newton-Raphson but **without needing the derivative**. Approximate f'(x) using two previous points.

### Formula
```
x_{n+1} = x_n - f(x_n) × (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
```

### Requirements
- TWO initial guesses (x₀ and x₁)
- Do NOT need to bracket the root
- Do NOT need the derivative

### Algorithm
1. Choose x₀ and x₁
2. Compute x₂ using the formula
3. Shift: old x₁ becomes x_{n-1}, x₂ becomes x_n
4. Repeat until |x_{n+1} − x_n| < ε

### Worked Example: `f(x) = x^3 - x - 1`

Setup: x₀ = 1, x₁ = 2, f(1) = −1, f(2) = 5

**Iteration 1:**
```
x₂ = x₁ - f(x₁) × (x₁ - x₀) / (f(x₁) - f(x₀))
   = 2 - 5 × (2 - 1) / (5 - (-1))
   = 2 - 5/6
   = 1.1667
f(1.1667) = -0.5797
```

**Iteration 2:**
```
Now x_{n-1} = 2, x_n = 1.1667
x₃ = 1.1667 - (-0.5797) × (1.1667 - 2) / (-0.5797 - 5)
   = 1.1667 - (-0.5797)(-0.8333) / (-5.5797)
   = 1.1667 + 0.0866
   = 1.2533
```

**Iteration 3:**
```
x₄ = 1.2533 - (-0.2853) × (1.2533 - 1.1667) / (-0.2853 - (-0.5797))
   = 1.3372
```

Continuing... after 5-6 iterations: **x ≈ 1.3247**

---

## TOPIC 5: GAUSS ELIMINATION

### Problem Type
Solve systems of linear equations:
```
2x + y - z = 8
-3x - y + 2z = -11
-2x + y + 2z = -3
```
Find x, y, z.

### Two Phases
1. **Forward Elimination** — make zeros BELOW the diagonal (upper triangular)
2. **Back Substitution** — solve from bottom row up

### Allowed Row Operations
- Swap two rows
- Multiply a row by a non-zero constant
- Add a multiple of one row to another row

### Worked Example

**Step 1 — Write augmented matrix:**
```
[  2   1  -1  |  8 ]
[ -3  -1   2  | -11]
[ -2   1   2  | -3 ]
```

**Step 2 — Eliminate x from R2, R3:**
```
R2 = R2 + (3/2)R1:
[-3 + (3/2)(2), -1 + (3/2)(1), 2 + (3/2)(-1), -11 + (3/2)(8)]
= [0, 0.5, 0.5, 1]

R3 = R3 + R1:
[-2+2, 1+1, 2-1, -3+8] = [0, 2, 1, 5]
```

Result:
```
[ 2   1   -1   | 8 ]
[ 0   0.5  0.5 | 1 ]
[ 0   2    1   | 5 ]
```

**Step 3 — Eliminate y from R3:**
```
R3 = R3 - 4·R2:
[0, 2-4(0.5), 1-4(0.5), 5-4(1)] = [0, 0, -1, 1]
```

Upper triangular:
```
[ 2   1   -1   | 8 ]
[ 0   0.5  0.5 | 1 ]
[ 0   0   -1   | 1 ]
```

**Step 4 — Back Substitution:**
- Row 3: −z = 1 → **z = −1**
- Row 2: 0.5y + 0.5(−1) = 1 → 0.5y = 1.5 → **y = 3**
- Row 1: 2x + 3 − (−1) = 8 → 2x = 4 → **x = 2**

**Answer: x = 2, y = 3, z = −1**

### Practice Problem
```
x + y + z = 6
2x + 3y + z = 14
x + y + 2z = 9
```

**Solution:**

Matrix:
```
[ 1  1  1 | 6  ]
[ 2  3  1 | 14 ]
[ 1  1  2 | 9  ]
```

- R2 = R2 − 2R1 → [0, 1, −1, 2]
- R3 = R3 − R1 → [0, 0, 1, 3]

Already upper triangular:
```
[ 1  1   1 | 6 ]
[ 0  1  -1 | 2 ]
[ 0  0   1 | 3 ]
```

Back substitution:
- z = 3
- y − z = 2 → y = 5
- x + y + z = 6 → x = 6 − 5 − 3 = −2

**Answer: x = −2, y = 5, z = 3**

---

## TOPIC 6: GAUSS-JORDAN ELIMINATION

### Core Idea
Extension of Gauss Elimination. Instead of stopping at upper triangular, keep going until you get the **identity matrix**. Then read answers directly — no back substitution needed.

### Difference from Gauss
| Gauss Elimination | Gauss-Jordan |
|-------------------|--------------|
| Zeros BELOW diagonal | Zeros BELOW and ABOVE diagonal |
| Upper triangular form | Identity matrix (reduced row echelon form) |
| Needs back substitution | Read answers directly |
| Fewer operations | More operations |

### Target Form
```
[ 1  0  0 | x ]
[ 0  1  0 | y ]
[ 0  0  1 | z ]
```

### Worked Example (same system as Gauss)

Starting matrix:
```
[  2   1  -1  |  8 ]
[ -3  -1   2  | -11]
[ -2   1   2  | -3 ]
```

**Step 1: Make a11 = 1 (divide R1 by 2)**
```
[  1   0.5  -0.5 |  4 ]
[ -3  -1    2    | -11]
[ -2   1    2    | -3 ]
```

**Step 2: Make zeros in column 1**
- R2 = R2 + 3R1
- R3 = R3 + 2R1
```
[ 1   0.5  -0.5 | 4 ]
[ 0   0.5   0.5 | 1 ]
[ 0   2     1   | 5 ]
```

**Step 3: Make a22 = 1 (divide R2 by 0.5)**
```
[ 1   0.5  -0.5 | 4 ]
[ 0   1     1   | 2 ]
[ 0   2     1   | 5 ]
```

**Step 4: Make zeros in column 2 (above AND below pivot)**
- R1 = R1 − 0.5·R2
- R3 = R3 − 2·R2
```
[ 1   0   -1   | 3 ]
[ 0   1    1   | 2 ]
[ 0   0   -1   | 1 ]
```

**Step 5: Make a33 = 1 (divide R3 by −1)**
```
[ 1   0  -1 | 3 ]
[ 0   1   1 | 2 ]
[ 0   0   1 | -1]
```

**Step 6: Make zeros in column 3**
- R1 = R1 + R3
- R2 = R2 − R3
```
[ 1   0   0 |  2 ]
[ 0   1   0 |  3 ]
[ 0   0   1 | -1 ]
```

**Answer (read directly): x = 2, y = 3, z = −1**

---

## METHOD COMPARISON TABLE

| Feature          | Bisection | False Position | Newton-Raphson | Secant   |
|------------------|-----------|----------------|----------------|----------|
| Initial guesses  | 2 (a, b)  | 2 (a, b)       | 1 (x₀)         | 2 (x₀,x₁)|
| Needs f(a)·f(b)<0| YES       | YES            | NO             | NO       |
| Needs derivative | NO        | NO             | **YES**        | NO       |
| Convergence      | Slow      | Medium         | Fastest        | Fast     |
| Always converges | YES       | YES            | Not always     | Not always|
| Type             | Bracketing| Bracketing     | Open           | Open     |

### Linear Systems

| Feature       | Gauss Elimination  | Gauss-Jordan          |
|---------------|--------------------|-----------------------|
| Final form    | Upper triangular   | Identity (RREF)       |
| Back sub?     | YES                | NO                    |
| Row operations| Fewer              | More                  |
| Read answer   | After back sub     | Directly from matrix  |

---

## EXAM TIPS

### General Strategy
1. **Read the question carefully** — which method does it ask for?
2. **Check signs first** for bracketing methods (Bisection, False Position)
3. **Compute the derivative** before starting Newton-Raphson
4. **Make a clear table** of iterations — graders love tables
5. **Show every calculation** — partial credit for correct steps
6. **Round to the specified decimal places** in the final answer
7. **Check the stopping criterion** carefully (|x_n+1 − x_n| < ε)

### Common Mistakes to Avoid
- ❌ Using Bisection when you don't have opposite signs
- ❌ Forgetting to compute the derivative for Newton-Raphson
- ❌ Confusing False Position formula with Bisection formula
- ❌ Wrong sign when doing row operations in Gauss
- ❌ Stopping iterations too early/late
- ❌ Arithmetic errors in back substitution

### Key Formulas Cheat Sheet

**Bisection:**
```
c = (a + b) / 2
```

**False Position:**
```
x_r = b − f(b)(a − b) / (f(a) − f(b))
   OR
x_r = [a·f(b) − b·f(a)] / [f(b) − f(a)]
```

**Newton-Raphson:**
```
x_{n+1} = x_n − f(x_n) / f'(x_n)
```

**Secant:**
```
x_{n+1} = x_n − f(x_n)·(x_n − x_{n-1}) / (f(x_n) − f(x_{n-1}))
```

**Minimum iterations (Bisection):**
```
n ≥ log((b−a)/ε) / log(2)
```

**Stopping criterion:**
```
|x_n+1 − x_n| < ε
```

### Decision Rule for Bracketing Methods
After computing c (or x_r) and f(c):
- **If f(a) × f(c) < 0** (opposite signs) → root in [a, c] → **b = c**
- **If f(a) × f(c) > 0** (same signs) → root in [c, b] → **a = c**
- **If f(c) = 0** → c IS the root, STOP

---

## STUDY CHECKLIST

- [ ] Understand why we need numerical methods
- [ ] Know the 4 types of errors
- [ ] Bisection Method — formula, conditions, algorithm
- [ ] Bisection — do 2 example problems from scratch
- [ ] False Position — formula and difference from Bisection
- [ ] False Position — do 1 example problem
- [ ] Newton-Raphson — formula and derivatives
- [ ] Newton-Raphson — practice computing derivatives
- [ ] Newton-Raphson — do 1 example problem
- [ ] Secant Method — formula and difference from Newton-Raphson
- [ ] Secant — do 1 example problem
- [ ] Gauss Elimination — row operations, upper triangular, back sub
- [ ] Gauss Elimination — do 1 3x3 system
- [ ] Gauss-Jordan — identity matrix approach
- [ ] Gauss-Jordan — do 1 3x3 system
- [ ] Memorize the comparison table
- [ ] Memorize all 4 root-finding formulas
- [ ] Practice with interactive study guide (study-guide.html)

---

## FILES IN THIS FOLDER

| File | Purpose |
|------|---------|
| `COMPLETE_NOTES.md` | This file — all theory and examples |
| `study-guide.html` | Interactive web study guide (open in browser) |
| `STUDY_PLAN.md`     | 2-day study plan outline |

---

**Good luck on your exam!** Re-visit this file anytime to refresh your memory. The interactive `study-guide.html` has calculators to practice with.
