Private Sub Worksheet_Change(ByVal Target As Range)
    If Not Intersect(Target, Range("b1")) Is Nothing Then
Range("C2:d3").ClearContents
    End If
End Sub
