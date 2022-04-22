# MinnPost Largo
Largo child theme for MinnPost

## Typography

In this version, we're using [this type scale](https://type-scale.com/?size=24&scale=1.125&text=A%20Visual%20Type%20Scale&font=Poppins&fontweight=400&bodyfont=Poppins&bodyfontweight=400&lineheight=1.65&backgroundcolor=white&fontcolor=%23333&preview=false) for our font sizes.

We set the root size like this:

```css
html {
    font-size: 125%; // 100% is 16px

    @include breakpoint-min( xl ) {
        font-size: 150%;
    }
}
```

At times, for example on related stories and in footer widgets, we reduce that base font size to a smaller percentage.

We then set the sizes, in `em`s, using [this technique](https://24ways.org/2019/a-modern-typographic-scale/), which is also a [gist](https://gist.github.com/robweychert/46b666c096902f578bd41bb47a5cdd43).

We're serving fonts via Adobe Fonts, and our families are [FF Meta Serif](https://fonts.adobe.com/fonts/ff-meta-serif) for body text and headings, and [FF Meta](https://fonts.adobe.com/fonts/ff-meta) for supplemental text. Captions and summaries and navigation and such.

## Colors

We're using [this color palette](https://minnpost-color-matrix.herokuapp.com/?n=red%3Adark&n=red%3Amedium&n=red%3Ahighlight&n=green%3Adark&n=green%3Amedium&n=green%3Ahighlight&n=green%3Abackground&n=blue%3Adark&n=blue%3Amedium&n=blue%3Ahighlight&n=blue%3Abackground&n=purple%3Adark&n=purple%3Amedium&n=purple%3Ahighlight&n=purple%3Abackground&n=yellow%3Abackground&n=neutral%3Ablack&n=neutral%3Adark&n=neutral%3Amedium&n=neutral%3Aborder&n=neutral%3Ahighlight&n=neutral%3Alight&n=neutral%3Awhite&v=4C1016&v=7F121C&v=D7757E&v=24613B&v=1C8745&v=609F78&v=DDF8E7&v=135B7E&v=0C7BB0&v=5E99B5&v=DCF0FA&v=635077&v=8C64B4&v=A880D0&v=EBE7EF&v=FBD341&v=1A1818&v=5E6E76&v=869298&v=D6D6DA&v=EBEBFB&v=EFEFF0&v=FFFFFF). Use this URL to see contrast ratios.

## Grid

We're setting our flex-based responsive grid with [column-setter](https://github.com/propublica/column-setter). We can see the grid overlay by adding `?grid=true` to the end of any URL.
