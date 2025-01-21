const loadData = async () => {
  const [EBSH1, EBSK1_4, EBSH3A, EBSS, EBST, EBSZ, WELL] = await Promise.all([
    import("@/example-data/H1"),
    import("@/example-data/K"),
    import("@/example-data/H3"),
    import("@/example-data/S"),
    import("@/example-data/T"),
    import("@/example-data/Z"),
    import("@/example-data/well"),
  ]);
  console.log("EBSK5_9", EBSK1_4, EBSH3A);
  console.log("2", WELL);
  return {
    WELL: WELL.data,
    EBSH1: EBSH1.data,
    EBSK1_4: EBSK1_4.k1,
    EBSK5_9: EBSK1_4.k5,
    EBSH3A: EBSH3A.h3a,
    EBSH3B: EBSH3A.h3b,
    EBSS: EBSS.data,
    EBST: EBST.data,
    EBSZ: EBSZ.data,
  };
};
export const {
  EBSH1,
  EBSK1_4,
  EBSK5_9,
  EBSH3A,
  EBSH3B,
  EBSS,
  EBST,
  EBSZ,
  WELL,
} = await loadData();
