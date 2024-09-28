"use client"

import { useState } from "react"
import Searchbar from "../../search/Searchbar"
import DeepImageGrid, { DeepImageGridFetchAction } from "../../grid/deepImageGrid/DeepImageGrid"
import { ProcessedImage } from "@/data/api/types/model/types"
import { ScrollModal } from "../ScrollModal"
import XButton from "../../button/XButton"
import CheckButton from "../../button/CheckButton"

type SelectTemplateModalProps = {
  fetchAction: DeepImageGridFetchAction
  onTemplateSelect: (image: ProcessedImage) => void
  onCancel: () => void
  onConfirm: () => void
}

export function SelectTemplateModal({
  fetchAction,
  onTemplateSelect,
  onCancel,
  onConfirm,
}: SelectTemplateModalProps) {
  const [query, setQuery] = useState<string>("")
  const buttons = [
    <XButton key="cancel" onClick={onCancel} />,
    <CheckButton key="confirm" onClick={onConfirm} />,
  ]
  const prefixedChildren = (
    <Searchbar
      searchItemName="template"
      onSearch={(input) => setQuery(input)}
    />
  )

  return (
    <ScrollModal
      title="Select Template"
      buttons={buttons}
      prefixedChildren={prefixedChildren}
    >
      <DeepImageGrid
        fetchAction={fetchAction}
        query={query}
        pageSize={10}
        onImageClick={onTemplateSelect}
        maxColumnCount={3}
      />
    </ScrollModal>
  )
}
