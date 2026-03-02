import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/sprinner"

export function SpinnerEmpty({ message, isError }) {
  return (
    // <Empty className="w-full min-h-screen bg-muted/40">
    //   <EmptyHeader>
    //     <EmptyMedia variant="icon">
    //       <Spinner />
    //     </EmptyMedia>

    //     <EmptyTitle>Processing your request</EmptyTitle>

    //     <EmptyDescription>
    //       Please wait while we process your request. Do not refresh the page.
    //     </EmptyDescription>
    //   </EmptyHeader>

    //   <EmptyContent>
    //     <Button variant="outline" size="sm">
    //       Cancel
    //     </Button>
    //   </EmptyContent>
    // </Empty>
    <Empty className="w-full min-h-screen bg-muted/40">

      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>

        <EmptyTitle>
          {isError ? "Something went wrong" : "Processing your request"}
        </EmptyTitle>

        <EmptyDescription>
          {message}
        </EmptyDescription>
      </EmptyHeader>

    </Empty>
  )
}