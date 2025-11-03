import type {Variant} from 'framer-motion'

type defaultType = {
  initial: Variant;
  animate: Variant
}



export const logoVariant : defaultType = {
  initial: {
    opacity: 0,
    x:-50,
  },
  animate: {
    opacity: 1,
    x:0,
    transition: {
      duration: .5,
      delay: 1.5,
    }
  }
}

export const linkVariant : defaultType & {animate: (index: number) => Variant} = {
  initial: {
    y:100,
  },
  animate: (index: number) => ({
    y:0,
    transition: {
      duration: 1,
      delay: (index+0.5) * 0.2
    }
  })
}

export const btnVariant : defaultType = {
  initial: {
    opacity: 0,
    x:30,
  },
  animate: {
    opacity: 1,
    x:0,
    transition: {
      duration: .5,
      delay: 1.8,
    }
  }
}