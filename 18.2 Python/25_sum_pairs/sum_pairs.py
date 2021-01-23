def sum_pairs(nums, goal):
    """Return tuple of first pair of nums that sum to goal.

    For example:

        >>> print(sum_pairs([1, 2, 2, 10], 4))
        (2, 2)

    (4, 2) sum to 6, and come before (5, 1):

        >>> print(sum_pairs([4, 2, 10, 5, 1], 6)) # (4, 2)
        (4, 2)

    (4, 3) sum to 7, and finish before (5, 2): BY WHAT STRETCH OF THE IMAGINATION

        >>> print(sum_pairs([5, 1, 4, 8, 3, 2], 7))
        (4, 3)

    No pairs sum to 100, so return empty tuple:

        >>> print(sum_pairs([11, 20, 4, 2, 1, 5], 100))
        ()

        checked solution. my way is better
    """
    index = 1

    for num in nums:
        for num2 in nums[index:]
            if num + num2 == goal:
                return (num, num2)
                
        index += 1

    return ()
